/** Staff roles and the code the bakery shares with new team members. */

export type StaffRole = "manager" | "staff" | "baker" | "rider";

export const STAFF_INVITE_CODE = "TAMU-2026";

export const staffRoles: StaffRole[] = ["manager", "staff", "baker", "rider"];

export const roleLabel: Record<StaffRole, string> = {
  manager: "Manager",
  staff: "Front of house",
  baker: "Baker",
  rider: "Rider",
};

export const roleBlurb: Record<StaffRole, string> = {
  manager: "Full access, can change roles and remove people",
  staff: "Takes orders and updates payment status",
  baker: "Works the bake list",
  rider: "Handles deliveries",
};

export function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "TB"
  );
}
