import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bell,
  ChefHat,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  Search,
  Users,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initials, useStaffAuth } from "@/lib/staff-auth";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", icon: Receipt, exact: false },
  { to: "/admin/team", label: "Team", icon: Users, exact: false },
] as const;

export function AdminShell({
  title,
  breadcrumb,
  children,
}: {
  title: string;
  breadcrumb: string;
  children: ReactNode;
}) {
  const { user, signOut } = useStaffAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-admin-bg">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-admin-surface transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ChefHat className="size-5" />
            </span>
            <span className="font-display text-lg">Tamu</span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            className="text-muted-foreground lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="px-5 pb-2 pt-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Bakehouse
        </p>
        <nav className="space-y-1 px-3">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-warm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-3 bottom-4 rounded-2xl bg-secondary p-4">
          <p className="text-xs font-semibold">Device-only data</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Orders and staff accounts are stored on this device until the bakery's
            shared account system is switched on.
          </p>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-admin-surface/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            aria-label="Open menu"
            className="text-muted-foreground lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders, customers…"
              className="h-10 rounded-xl border-0 bg-secondary pl-9"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              className="grid size-10 place-items-center rounded-xl text-muted-foreground hover:bg-secondary"
            >
              <Bell className="size-5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-secondary">
                <span className="grid size-9 place-items-center rounded-full bg-cocoa text-sm font-semibold text-cocoa-foreground">
                  {initials(user?.name ?? "Staff")}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-semibold leading-tight">
                    {user?.name}
                  </span>
                  <span className="block text-xs capitalize text-muted-foreground">
                    {user?.role}
                  </span>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/">View the shop</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    signOut();
                    void navigate({ to: "/admin/login", replace: true });
                  }}
                >
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            Bakehouse <span className="mx-1">/</span>
            <span className="text-foreground">{breadcrumb}</span>
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl">{title}</h1>
          <div className="mt-6 space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function AdminCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-admin-surface p-5 shadow-warm",
        className,
      )}
    >
      {children}
    </div>
  );
}
