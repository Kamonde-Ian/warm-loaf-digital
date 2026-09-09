import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminCard, AdminShell } from "@/components/admin/admin-shell";
import { RequireStaff } from "@/components/admin/require-staff";
import { statusStyle } from "@/components/admin/status";
import { formatKES } from "@/lib/products";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listOrders } from "@/lib/orders.functions";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Orders — Tamu Bakehouse Staff" },
      {
        name: "description",
        content: "Every bakery order with fulfilment and payment status.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireStaff>
      <Orders />
    </RequireStaff>
  ),
});

const filters = ["all", "pending", "paid", "delivery", "pickup"] as const;

function Orders() {
  const fetchOrders = useServerFn(listOrders);
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(),
  });
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [q, setQ] = useState("");

  const rows = orders.filter((o) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "delivery" || filter === "pickup"
          ? o.fulfilment === filter
          : o.paymentStatus === filter;
    const needle = q.trim().toLowerCase();
    const matchesQuery =
      !needle ||
      o.code.toLowerCase().includes(needle) ||
      o.customer.name.toLowerCase().includes(needle) ||
      o.customer.phone.includes(needle);
    return matchesFilter && matchesQuery;
  });

  return (
    <AdminShell title="Orders" breadcrumb="Orders">
      <AdminCard className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              {filters.map((f) => (
                <TabsTrigger key={f} value={f} className="capitalize">
                  {f}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search order or customer"
            className="h-10 w-full rounded-xl sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Fulfilment</TableHead>
                <TableHead>Ready</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((order) => (
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
                  <TableCell className="max-w-xs text-sm text-muted-foreground">
                    {order.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                  </TableCell>
                  <TableCell className="capitalize">
                    {order.fulfilment}
                    {order.customer.area && (
                      <span className="block text-xs text-muted-foreground">
                        {order.customer.area}
                      </span>
                    )}
                  </TableCell>
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
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No orders match that view yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </AdminCard>
    </AdminShell>
  );
}
