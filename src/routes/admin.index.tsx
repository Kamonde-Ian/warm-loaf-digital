import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Clock,
  Receipt,
  TrendingUp,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminCard, AdminShell } from "@/components/admin/admin-shell";
import { RequireStaff } from "@/components/admin/require-staff";
import { statusStyle } from "@/components/admin/status";
import { formatKES } from "@/lib/products";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listOrders } from "@/lib/orders.functions";
import { useStaffAuth } from "@/lib/staff-auth";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Staff Dashboard — Tamu Bakehouse" },
      {
        name: "description",
        content:
          "Incoming bakery orders, pickup and delivery details and M-Pesa payment status.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireStaff>
      <Dashboard />
    </RequireStaff>
  ),
});

function Dashboard() {
  const { user } = useStaffAuth();
  const fetchOrders = useServerFn(listOrders);
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(),
  });
  const revenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((n, o) => n + o.total, 0);
  const pending = orders.filter((o) => o.paymentStatus === "pending").length;
  const deliveries = orders.filter((o) => o.fulfilment === "delivery").length;
  const recent = orders.slice(0, 6);

  const stats = [
    { label: "Orders", value: String(orders.length), icon: Receipt, hint: "All time" },
    { label: "Paid revenue", value: formatKES(revenue), icon: TrendingUp, hint: "M-Pesa & card" },
    { label: "Awaiting payment", value: String(pending), icon: Clock, hint: "Follow up" },
    { label: "Deliveries", value: String(deliveries), icon: Truck, hint: "To dispatch" },
  ];

  return (
    <AdminShell title={`Karibu, ${user?.name.split(" ")[0]}`} breadcrumb="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <AdminCard key={stat.label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 font-display text-2xl">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
              </div>
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <stat.icon className="size-5" />
              </span>
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminCard className="p-0">
        <div className="flex items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h2 className="text-lg">Latest orders</h2>
            <p className="text-sm text-muted-foreground">
              Newest first, straight from the shop.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            All orders <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Fulfilment</TableHead>
                <TableHead>Ready</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <Link
                      to="/order/$id"
                      params={{ id: order.code }}
                      className="hover:text-primary"
                    >
                      {order.code}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {order.customer.name}
                    <span className="block text-xs text-muted-foreground">
                      {order.customer.phone}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">{order.fulfilment}</TableCell>
                  <TableCell className="text-sm">{order.readyAt}</TableCell>
                  <TableCell>
                    <Badge className={statusStyle[order.paymentStatus]}>
                      {order.paymentStatus.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-display">
                    {formatKES(order.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </AdminCard>
    </AdminShell>
  );
}
