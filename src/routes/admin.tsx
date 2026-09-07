import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatKES } from "@/lib/products";
import { listOrders, type PaymentStatus } from "@/lib/orders";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Staff Dashboard — Tamu Bakehouse" },
      {
        name: "description",
        content:
          "Internal view of incoming bakery orders, pickup and delivery details and M-Pesa payment status.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const statusStyle: Record<PaymentStatus, string> = {
  paid: "bg-primary text-primary-foreground",
  pending: "bg-accent text-accent-foreground",
  failed: "bg-destructive text-destructive-foreground",
  cash_on_delivery: "bg-secondary text-secondary-foreground",
};

function Admin() {
  const orders = useMemo(() => listOrders(), []);
  const revenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((n, o) => n + o.total, 0);
  const pending = orders.filter((o) => o.paymentStatus === "pending").length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="eyebrow">Internal</p>
      <h1 className="mt-3 text-4xl">Staff dashboard</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Orders placed on this device. Sign-in and shared, live orders arrive when the
        bakery's account system is switched on.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Orders", value: String(orders.length) },
          { label: "Paid revenue", value: formatKES(revenue) },
          { label: "Awaiting payment", value: String(pending) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-card">
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
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <Link
                    to="/order/$id"
                    params={{ id: order.id }}
                    className="hover:text-primary"
                  >
                    {order.id}
                  </Link>
                </TableCell>
                <TableCell>
                  {order.customer.name}
                  <span className="block text-xs text-muted-foreground">
                    {order.customer.phone}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
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
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
