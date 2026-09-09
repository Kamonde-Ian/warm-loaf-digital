import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { AdminCard, AdminShell } from "@/components/admin/admin-shell";
import { RequireStaff } from "@/components/admin/require-staff";
import { STAFF_INVITE_CODE, initials, useStaffAuth } from "@/lib/staff-auth";

export const Route = createFileRoute("/admin/team")({
  head: () => ({
    meta: [
      { title: "Team — Tehila Royal Kitchen Staff" },
      {
        name: "description",
        content: "Staff accounts with access to the Tehila Royal Kitchen dashboard.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireStaff>
      <Team />
    </RequireStaff>
  ),
});

function Team() {
  const { accounts, user } = useStaffAuth();

  return (
    <AdminShell title="Team" breadcrumb="Team">
      <AdminCard>
        <h2 className="text-lg">Invite a team member</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Share this code and the sign-up page. The first account created becomes the
          manager; everyone after joins as staff.
        </p>
        <p className="mt-4 inline-flex rounded-xl bg-secondary px-4 py-2 font-display text-lg tracking-widest">
          {STAFF_INVITE_CODE}
        </p>
      </AdminCard>

      <AdminCard>
        <h2 className="text-lg">Accounts on this device</h2>
        <ul className="mt-4 divide-y divide-border">
          {accounts.map((a) => (
            <li key={a.id} className="flex items-center gap-3 py-3">
              <span className="grid size-10 place-items-center rounded-full bg-cocoa text-sm font-semibold text-cocoa-foreground">
                {initials(a.name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{a.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {a.email}
                </span>
              </span>
              <span className="ml-auto flex items-center gap-2">
                {a.id === user?.id && <Badge variant="outline">You</Badge>}
                <Badge className="capitalize">{a.role}</Badge>
              </span>
            </li>
          ))}
        </ul>
      </AdminCard>
    </AdminShell>
  );
}
