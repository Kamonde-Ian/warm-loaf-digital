import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, DELIVERY_FEE } from "@/lib/cart";
import { formatKES } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Basket — Tamu Bakehouse" },
      {
        name: "description",
        content:
          "Review your bakery basket, adjust quantities and continue to M-Pesa checkout for pickup or Nairobi delivery.",
      },
      { property: "og:title", content: "Your Basket — Tamu Bakehouse" },
      {
        property: "og:description",
        content: "Review your order and pay with M-Pesa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <p className="eyebrow">Your order</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">The basket</h1>

      {items.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-border bg-card py-20 text-center">
          <ShoppingBag className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground">
            Your basket is empty — the ovens are still full though.
          </p>
          <Button asChild className="rounded-full">
            <Link to="/shop">Browse the menu</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y divide-border rounded-3xl border border-border bg-card">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 p-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width={96}
                    height={96}
                    className="size-24 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex size-24 items-center justify-center rounded-2xl bg-secondary text-xs text-secondary-foreground">
                    Custom
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-display text-lg leading-tight">{item.name}</p>
                  {item.unit && (
                    <p className="text-xs text-muted-foreground">{item.unit}</p>
                  )}
                  {item.notes && (
                    <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                      {Object.entries(item.notes)
                        .filter(([, v]) => v)
                        .map(([k, v]) => (
                          <li key={k}>
                            <span className="capitalize">{k}</span>: {v}
                          </li>
                        ))}
                    </ul>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-8 rounded-full"
                      aria-label="Decrease quantity"
                      onClick={() => setQty(item.id, item.qty - 1)}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-8 rounded-full"
                      aria-label="Increase quantity"
                      onClick={() => setQty(item.id, item.qty + 1)}
                    >
                      <Plus className="size-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="ml-2 size-8 text-muted-foreground"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => remove(item.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <p className="font-display">{formatKES(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatKES(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery (Nairobi)</dt>
                <dd>from {formatKES(DELIVERY_FEE)}</dd>
              </div>
            </dl>
            <Button asChild size="lg" className="mt-6 w-full rounded-full">
              <Link to="/checkout">Checkout with M-Pesa</Link>
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full">
              <Link to="/shop">Keep shopping</Link>
            </Button>
          </aside>
        </div>
      )}
    </main>
  );
}
