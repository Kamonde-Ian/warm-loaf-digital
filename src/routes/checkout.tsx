import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DELIVERY_FEE, useCart } from "@/lib/cart";
import { formatKES } from "@/lib/products";
import {
  MPESA_TILL,
  normalizePhone,
  pollPaymentStatus,
  requestStkPush,
} from "@/lib/mpesa";
import { createOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout & M-Pesa Payment — Tehila Royal Kitchen" },
      {
        name: "description",
        content:
          "Choose pickup on Ngong Road or delivery in Nairobi, then pay securely with an M-Pesa prompt sent to your phone.",
      },
      {
        property: "og:title",
        content: "Checkout & M-Pesa Payment — Tehila Royal Kitchen",
      },
      {
        property: "og:description",
        content: "Pay for your bakery order with M-Pesa in a few taps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const [fulfilment, setFulfilment] = useState<"delivery" | "pickup">("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [stage, setStage] = useState<"form" | "prompt" | "confirming">("form");

  const fee = fulfilment === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + fee;

  async function pay() {
    const msisdn = normalizePhone(phone);
    if (!name.trim()) {
      toast.error("Please add the name for the order.");
      return;
    }
    if (!msisdn) {
      toast.error("Enter a valid Safaricom number, e.g. 0723 574 088.");
      return;
    }
    if (fulfilment === "delivery" && !area.trim()) {
      toast.error("Tell us which part of Nairobi to deliver to.");
      return;
    }


    setStage("prompt");
    const push = await requestStkPush({ phone: msisdn, amount: total, reference: msisdn });
    toast.success(push.customerMessage);

    setStage("confirming");
    await pollPaymentStatus();

    try {
      const created = await createOrder({
        data: {
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            qty: item.qty,
            price: item.price,
            ...(item.unit ? { unit: item.unit } : {}),
          })),
          fulfilment,
          customer: {
            name: name.trim(),
            phone: msisdn,
            ...(area.trim() ? { area: area.trim() } : {}),
            ...(address.trim() ? { address: address.trim() } : {}),
            ...(note.trim() ? { note: note.trim() } : {}),
          },
          paymentMethod: "mpesa",
          mpesaRef: push.checkoutRequestId,
          readyAt:
            fulfilment === "pickup"
              ? "Tomorrow, from 8:00 AM"
              : "Tomorrow, 10:00 AM – 1:00 PM",
        },
      });
      clear();
      navigate({ to: "/order/$id", params: { id: created.code } });
    } catch (error) {
      setStage("form");
      toast.error(
        error instanceof Error ? error.message : "Could not place that order.",
      );
    }
  }

  if (items.length === 0 && stage === "form") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-4xl">Nothing to pay for yet</h1>
        <p className="mt-4 text-muted-foreground">
          Add a loaf or two and we'll get the M-Pesa prompt ready.
        </p>
        <Button asChild className="mt-8 rounded-full">
          <Link to="/shop">Go to the menu</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <p className="eyebrow">Almost there</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Checkout</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-2xl">How would you like it?</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(["delivery", "pickup"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFulfilment(option)}
                  className={
                    "rounded-2xl border p-4 text-left transition-colors " +
                    (fulfilment === option
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary")
                  }
                >
                  <p className="font-medium capitalize">{option}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {option === "delivery"
                      ? `Across Nairobi, from ${formatKES(DELIVERY_FEE)}`
                      : "Collect on Ngong Road, free"}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl">Your details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Achieng Otieno"
                  className="mt-1.5 bg-card"
                />
              </div>
              <div>
                <Label htmlFor="phone">M-Pesa number</Label>
                <Input
                  id="phone"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0723 574 088"
                  className="mt-1.5 bg-card"
                />
              </div>
              {fulfilment === "delivery" && (
                <>
                  <div>
                    <Label htmlFor="area">Area / estate</Label>
                    <Input
                      id="area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Kilimani"
                      className="mt-1.5 bg-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Building & house no.</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Rose Apartments, B4"
                      className="mt-1.5 bg-card"
                    />
                  </div>
                </>
              )}
            </div>
            <div>
              <Label htmlFor="note">Notes for the bakers</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Slice the sourdough, please."
                className="mt-1.5 bg-card"
              />
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl">Order summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {item.qty} × {item.name}
                </span>
                <span>{formatKES(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatKES(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {fulfilment === "delivery" ? "Delivery" : "Pickup"}
              </dt>
              <dd>{fee ? formatKES(fee) : "Free"}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-display text-lg">
              <dt>Total</dt>
              <dd>{formatKES(total)}</dd>
            </div>
          </dl>

          <Button
            size="lg"
            className="mt-6 w-full rounded-full"
            disabled={stage !== "form"}
            onClick={pay}
          >
            {stage === "form" ? (
              <>
                <Smartphone className="size-4" />
                Pay {formatKES(total)} with M-Pesa
              </>
            ) : (
              <>
                <Loader2 className="size-4 animate-spin" />
                {stage === "prompt" ? "Sending prompt…" : "Confirming payment…"}
              </>
            )}
          </Button>

          <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
            You'll get an M-Pesa prompt on your phone. Till {MPESA_TILL}. We never
            see or store your PIN.
          </p>
        </aside>
      </div>
    </main>
  );
}
