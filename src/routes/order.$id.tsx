import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, Clock, MapPin, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatKES } from "@/lib/products";
import { getOrder } from "@/lib/orders";
import { BAKERY_PHONE } from "@/lib/mpesa";

export const Route = createFileRoute("/order/$id")({
  loader: ({ params }) => {
    const order = getOrder(params.id);
    if (!order) throw notFound();
    return { order };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Order unavailable — Tamu Bakehouse" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return {
      meta: [
        { title: `Order ${loaderData.order.id} — Tamu Bakehouse` },
        {
          name: "description",
          content: "Your Tamu Bakehouse order confirmation and M-Pesa payment status.",
        },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const { order } = Route.useLoaderData();
  const paid = order.paymentStatus === "paid";
  const failed = order.paymentStatus === "failed";

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        {failed ? (
          <XCircle className="mx-auto size-12 text-destructive" />
        ) : (
          <CheckCircle2 className="mx-auto size-12 text-primary" />
        )}
        <h1 className="mt-4 text-3xl sm:text-4xl">
          {failed ? "Payment didn't go through" : "Asante sana, order received"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          Order <span className="font-medium text-foreground">{order.id}</span> for{" "}
          {order.customer.name}. We've sent a confirmation SMS to{" "}
          {order.customer.phone}.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Badge
            className={
              paid
                ? "bg-primary text-primary-foreground"
                : failed
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-accent text-accent-foreground"
            }
          >
            {paid ? "M-Pesa paid" : failed ? "Payment failed" : "Payment pending"}
          </Badge>
          {order.mpesaRef && (
            <span className="text-xs text-muted-foreground">
              Ref {order.mpesaRef}
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Clock className="size-4 text-primary" /> Ready
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{order.readyAt}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="size-4 text-primary" />
            {order.fulfilment === "pickup" ? "Pickup" : "Delivery"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.fulfilment === "pickup"
              ? "Tamu Bakehouse, Ngong Road, Nairobi"
              : [order.customer.address, order.customer.area]
                  .filter(Boolean)
                  .join(", ")}
          </p>
        </div>
      </div>

      <ul className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-3 p-4 text-sm">
            <span>
              {item.qty} × {item.name}
            </span>
            <span className="font-display">
              {formatKES(item.price * item.qty)}
            </span>
          </li>
        ))}
        <li className="flex justify-between gap-3 p-4 font-display text-lg">
          <span>Total</span>
          <span>{formatKES(order.total)}</span>
        </li>
      </ul>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Questions about this order? Call us on {BAKERY_PHONE}.
      </p>

      <div className="mt-6 flex justify-center gap-3">
        <Button asChild className="rounded-full">
          <Link to="/shop">Order something else</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/">Back home</Link>
        </Button>
      </div>
    </main>
  );
}
