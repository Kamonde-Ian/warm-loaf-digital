import { Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.jpg.asset.json";
import { BAKERY_PHONE, WHATSAPP_NUMBER } from "@/lib/mpesa";
import { bestsellers, categories, formatKES, products } from "@/lib/products";

/**
 * Prototype assistant — answers from the site's own content (menu, prices,
 * hours, delivery, payment) and walks customers through a custom cake order.
 * No model call: keyword matching only. Swap `reply()` for an AI call later.
 */

type Msg = { role: "user" | "bot"; text: string };

const HOURS = "Mon – Sat, 7:00 AM – 7:00 PM · Sun, 8:00 AM – 3:00 PM";

const suggestions = [
  "What do you have today?",
  "How much is a cake?",
  "I want a custom cake",
  "Do you deliver?",
  "Opening hours",
];

function reply(raw: string): string {
  const q = raw.toLowerCase();
  const has = (...w: string[]) => w.some((x) => q.includes(x));

  const match = products.find(
    (p) => q.includes(p.name.toLowerCase()) || q.includes(p.slug.replace(/-/g, " ")),
  );
  if (match) {
    return `${match.name} — ${formatKES(match.price)} ${match.unit}. ${match.description} You can add it to your basket from the shop page.`;
  }

  if (has("custom", "birthday", "wedding", "order a cake", "bespoke")) {
    return `Lovely! For a custom cake I need four things:\n1. Occasion (birthday, wedding, baby shower…)\n2. Flavour — ${products
      .filter((p) => p.category === "Cakes")
      .slice(0, 4)
      .map((p) => p.name)
      .join(", ")}\n3. Size / number of servings\n4. Collection date (we ask for 3 days' notice)\n\nShare those here, or fill the Custom Cakes form and our baker will quote you within a few hours.`;
  }

  if (has("price", "cost", "how much", "pricing")) {
    return `Prices start at ${formatKES(Math.min(...products.map((p) => p.price)))}. A few examples: ${products
      .slice(0, 4)
      .map((p) => `${p.name} ${formatKES(p.price)}`)
      .join(", ")}. Custom cakes are quoted by size and design.`;
  }

  if (has("menu", "today", "what do you", "sell", "available", "bestseller", "popular")) {
    return `We bake ${categories.join(", ").toLowerCase()}. Today's favourites: ${bestsellers
      .slice(0, 4)
      .map((p) => `${p.name} (${formatKES(p.price)})`)
      .join(", ")}.`;
  }

  if (has("deliver", "delivery", "pickup", "collect", "area")) {
    return "You can collect from the shop on Ngong Road, or we deliver around Nairobi for a flat KES 300. Choose your option at checkout.";
  }

  if (has("pay", "mpesa", "m-pesa", "cash", "card")) {
    return "We take M-Pesa at checkout — you'll get a prompt on your phone — or you can pay cash on delivery.";
  }

  if (has("hour", "open", "close", "time")) return `We're open ${HOURS}.`;

  if (has("where", "location", "address", "directions", "find you")) {
    return "We're on Ngong Road, Nairobi, at the Kindaruma Lane junction — look for the terracotta door. Parking is at the back.";
  }

  if (has("phone", "call", "contact", "whatsapp", "number", "email")) {
    return `Call or WhatsApp us on ${BAKERY_PHONE}, or email hello@tehilaroyalkitchen.co.ke.`;
  }

  if (has("vegan", "gluten", "egg", "allergy", "nut", "sugar")) {
    return "We bake with real butter and wheat flour, so most bakes contain gluten and dairy. Tell us your requirement for a custom cake and we'll advise what we can do.";
  }

  if (has("hi", "hello", "hey", "habari", "sasa", "good morning", "good afternoon")) {
    return "Hello! I'm Tehila's little helper. Ask me about the menu, prices, delivery or a custom cake.";
  }

  if (has("thank", "asante", "bye")) return "Karibu! Enjoy your bakes. 🧁";

  return `I'm still learning. I can help with the menu, prices, delivery, payment, opening hours and custom cake orders — or reach the bakery directly on ${BAKERY_PHONE}.`;
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi! Welcome to Tehila Royal Kitchen. Ask me about our bakes, prices, delivery, or start a custom cake order.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, typing, open]);

  useEffect(() => {
    document.body.dataset["chatOpen"] = open ? "true" : "false";
  }, [open]);

  function send(text: string) {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { role: "user", text: value }]);
    setInput("");
    setTyping(true);
    const answer = reply(value);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "bot", text: answer }]);
    }, 600);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with Tehila Royal Kitchen"}
        className="fixed bottom-24 right-5 z-40 flex size-12 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-card shadow-lift transition-transform hover:-translate-y-1"
      >
        {open ? (
          <X className="size-5 text-foreground" />
        ) : (
          <img src={logoAsset.url} alt="" className="size-full object-cover" />
        )}
      </button>

      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[30rem] w-[min(22rem,calc(100vw-2.5rem))] animate-scale-in flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
          <div className="flex items-center gap-3 border-b border-border bg-cocoa px-4 py-3 text-cocoa-foreground">
            <img src={logoAsset.url} alt="" className="size-8 rounded-full object-cover" />
            <div className="leading-tight">
              <p className="font-display text-sm">Tehila Royal Kitchen</p>
              <p className="text-[0.68rem] text-cocoa-foreground/70">
                Prototype assistant · replies instantly
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="ml-auto"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] whitespace-pre-line rounded-2xl bg-primary px-3.5 py-2 text-sm text-primary-foreground"
                    : "max-w-[92%] whitespace-pre-line text-sm text-foreground/90"
                }
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <p className="text-sm text-muted-foreground">Checking the recipe book…</p>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border px-3 pb-3 pt-2">
            <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[0.7rem] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about cakes, delivery…"
                aria-label="Message"
                className="h-10 flex-1 rounded-full border border-input bg-background px-3.5 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <Send className="size-4" />
              </button>
            </form>
            <p className="mt-2 text-center text-[0.65rem] text-muted-foreground">
              For a detailed quote use the{" "}
              <Link to="/custom-cakes" className="underline">
                custom cake form
              </Link>{" "}
              or WhatsApp{" "}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer noopener"
                className="underline"
              >
                {BAKERY_PHONE}
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </>
  );
}
