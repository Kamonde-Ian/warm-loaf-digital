import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { formatKES } from "@/lib/products";

export function CartDrawer() {
  const { items, isOpen, setOpen, setQty, remove, subtotal, count } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">
            Your basket {count > 0 && <span className="text-primary">({count})</span>}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nothing here yet. The sourdough is still warm.
            </p>
            <Button asChild variant="secondary" onClick={() => setOpen(false)}>
              <Link to="/shop">Browse the shop</Link>
            </Button>
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width={80}
                    height={80}
                    className="size-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex size-20 items-center justify-center rounded-xl bg-secondary text-xs text-secondary-foreground">
                    Custom
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium leading-tight">{item.name}</p>
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
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-7 rounded-full"
                      aria-label="Decrease quantity"
                      onClick={() => setQty(item.id, item.qty - 1)}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-7 rounded-full"
                      aria-label="Increase quantity"
                      onClick={() => setQty(item.id, item.qty + 1)}
                    >
                      <Plus className="size-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="ml-auto size-7 text-muted-foreground"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => remove(item.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <p className="font-display text-sm">
                  {formatKES(item.price * item.qty)}
                </p>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <SheetFooter className="gap-3 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-display text-lg">{formatKES(subtotal)}</span>
            </div>
            <Button asChild size="lg" onClick={() => setOpen(false)}>
              <Link to="/checkout">Checkout with M-Pesa</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              <Link to="/cart">View full basket</Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
