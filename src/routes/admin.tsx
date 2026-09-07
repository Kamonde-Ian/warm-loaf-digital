import { createFileRoute, Outlet } from "@tanstack/react-router";
import { StaffAuthProvider } from "@/lib/staff-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Staff Area — Tamu Bakehouse" },
      {
        name: "description",
        content: "Internal Tamu Bakehouse staff area for orders and fulfilment.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <StaffAuthProvider>
      {/* Required: nested routes render here. */}
      <Outlet />
    </StaffAuthProvider>
  );
}
