import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { STAFF_INVITE_CODE, staffRoles, type StaffRole } from "./staff-roles";

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  roles: StaffRole[];
  createdAt: string;
};

/** Public: creates a staff account, gated by the bakery's invite code. */
export const signUpStaff = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { name: string; email: string; password: string; inviteCode: string }) => {
      if (input.inviteCode?.trim().toUpperCase() !== STAFF_INVITE_CODE) {
        throw new Error("That team code isn't right. Ask the bakery manager for it.");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email?.trim() ?? "")) {
        throw new Error("Enter a valid email address.");
      }
      if ((input.password ?? "").length < 8) {
        throw new Error("Use at least 8 characters for the password.");
      }
      return input;
    },
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.trim().toLowerCase();
    const name = data.name?.trim() || "Staff member";

    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true });
    const role: StaffRole = (count ?? 0) === 0 ? "manager" : "staff";

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: name },
    });
    if (error || !created.user) {
      const message = error?.message ?? "Could not create that account.";
      throw new Error(
        /already/i.test(message) ? "An account already exists for that email." : message,
      );
    }

    const userId = created.user.id;
    await supabaseAdmin.from("profiles").insert({ id: userId, full_name: name, email });
    await supabaseAdmin.from("user_roles").insert({ user_id: userId, role });

    return { role };
  });

/** Staff only: the team list with their roles. */
export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StaffMember[]> => {
    const { data: profiles, error } = await context.supabase
      .from("profiles")
      .select("id, full_name, email, created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    const { data: roles, error: rolesError } = await context.supabase
      .from("user_roles")
      .select("user_id, role");
    if (rolesError) throw new Error(rolesError.message);

    return (profiles ?? []).map((p) => ({
      id: p.id,
      name: p.full_name,
      email: p.email,
      createdAt: p.created_at,
      roles: (roles ?? [])
        .filter((r) => r.user_id === p.id)
        .map((r) => r.role as StaffRole),
    }));
  });

async function requireManager(
  supabase: {
    rpc: (
      fn: "has_role",
      args: { _user_id: string; _role: StaffRole },
    ) => PromiseLike<{ data: unknown }>;
  },
  userId: string,
) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "manager" });
  if (data !== true) throw new Error("Only a manager can change roles.");
}

/** Managers only: set someone's role. */
export const setStaffRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; role: StaffRole }) => {
    if (!staffRoles.includes(input.role)) throw new Error("Unknown role.");
    if (!input.userId) throw new Error("Pick a team member.");
    return input;
  })
  .handler(async ({ data, context }) => {
    await requireManager(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.role !== "manager") {
      const { data: managers } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .eq("role", "manager");
      const list = managers ?? [];
      if (list.length <= 1 && list.some((m) => m.user_id === data.userId)) {
        throw new Error("Keep at least one manager on the team.");
      }
    }

    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.userId, role: data.role });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Managers only: remove a staff account entirely. */
export const removeStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) => {
    if (!input.userId) throw new Error("Pick a team member.");
    return input;
  })
  .handler(async ({ data, context }) => {
    await requireManager(context.supabase, context.userId);
    if (data.userId === context.userId) {
      throw new Error("You can't remove your own account.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    await supabaseAdmin.from("profiles").delete().eq("id", data.userId);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
