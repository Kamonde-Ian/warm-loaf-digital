import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CakeSlice } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/reveal";
import { useCart } from "@/lib/cart";
import { formatKES } from "@/lib/products";
import celebration from "@/assets/p-celebration.jpg";

const flavours = ["Red velvet", "Dark chocolate", "Vanilla bean", "Spiced carrot", "Lemon"];
const sizes = [
  { label: '6" — serves 8', price: 4500 },
  { label: '8" — serves 15', price: 6500 },
  { label: '10" — serves 25', price: 9500 },
  { label: "2 tiers — serves 40", price: 14000 },
];

export const Route = createFileRoute("/custom-cakes")({
  head: () => ({
    meta: [
      { title: "Custom Cake Orders — Tamu Bakehouse Nairobi" },
      {
        name: "description",
        content:
          "Design your own celebration or wedding cake: pick flavour, size, colours and message. Hand-finished in Nairobi with two days' notice.",
      },
      { property: "og:title", content: "Custom Cake Orders — Tamu Bakehouse Nairobi" },
      {
        property: "og:description",
        content:
          "Birthdays, weddings and baby showers — tell us what you dream of and we'll bake it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CustomCakes,
});

function CustomCakes() {
  const { addCustomLine } = useCart();
  const navigate = useNavigate();

  const [flavour, setFlavour] = useState(flavours[0]!);
  const [size, setSize] = useState(sizes[1]!);
  const [colours, setColours] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [brief, setBrief] = useState("");

  function submit() {
    if (!date) {
      toast.error("Which day do you need the cake?");
      return;
    }
    addCustomLine({
      name: `Custom ${flavour} cake`,
      price: size.price,
      qty: 1,
      image: celebration,
      unit: size.label,
      notes: {
        flavour,
        size: size.label,
        ...(colours.trim() ? { colours: colours.trim() } : {}),
        ...(message.trim() ? { message: message.trim() } : {}),
        needed: date,
        ...(brief.trim() ? { brief: brief.trim() } : {}),
      },
    });
    toast.success("Your custom cake brief is in the basket.");
    navigate({ to: "/cart" });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="max-w-2xl">
        <p className="eyebrow">Made for your day</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Custom cakes</h1>
        <p className="mt-4 text-muted-foreground">
          Tell us the flavour, the size and the feeling. We hand-finish every cake in
          our Ngong Road kitchen and need two working days' notice (a week for
          weddings).
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <img
            src={celebration}
            alt="A hand-finished buttercream celebration cake with dried flowers"
            width={900}
            height={900}
            className="w-full rounded-3xl object-cover shadow-lift"
          />
        </Reveal>

        <div className="space-y-7">
          <section>
            <h2 className="font-display text-2xl">Flavour</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {flavours.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFlavour(f)}
                  className={
                    "rounded-full border px-4 py-2 text-sm transition-colors " +
                    (flavour === f
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary hover:text-primary")
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl">Size</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {sizes.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSize(s)}
                  className={
                    "rounded-2xl border p-4 text-left transition-colors " +
                    (size.label === s.label
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary")
                  }
                >
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="mt-1 font-display text-primary">
                    from {formatKES(s.price)}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="date">Date needed</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5 bg-card"
              />
            </div>
            <div>
              <Label htmlFor="colours">Colour palette</Label>
              <Input
                id="colours"
                value={colours}
                onChange={(e) => setColours(e.target.value)}
                placeholder="Terracotta & cream"
                className="mt-1.5 bg-card"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="message">Message on the cake</Label>
              <Input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Happy 30th, Wanjiku!"
                className="mt-1.5 bg-card"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="brief">Anything else?</Label>
              <Textarea
                id="brief"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Dried flowers on top, no fondant, nut-free please."
                className="mt-1.5 bg-card"
              />
            </div>
          </section>

          <Button size="lg" className="rounded-full" onClick={submit}>
            <CakeSlice className="size-4" />
            Add brief to basket · from {formatKES(size.price)}
          </Button>
          <p className="text-xs text-muted-foreground">
            Final price is confirmed by phone before we bake. Deposit is paid by
            M-Pesa at checkout.
          </p>
        </div>
      </div>
    </main>
  );
}
