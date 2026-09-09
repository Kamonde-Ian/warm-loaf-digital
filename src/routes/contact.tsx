import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/reveal";
import { BAKERY_PHONE, WHATSAPP_NUMBER } from "@/lib/mpesa";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Visit Us — Tehila Royal Kitchen, Ngong Road Nairobi" },
      {
        name: "description",
        content:
          "Find Tehila Royal Kitchen on Ngong Road, Nairobi. Opening hours, phone, WhatsApp orders and a message form for enquiries.",
      },
      {
        property: "og:title",
        content: "Visit Us — Tehila Royal Kitchen, Ngong Road Nairobi",
      },
      {
        property: "og:description",
        content: "Opening hours, directions and WhatsApp ordering.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function send() {
    if (!name.trim() || !message.trim()) {
      toast.error("Please add your name and a short message.");
      return;
    }
    toast.success("Thank you — we'll reply within a few hours.");
    setName("");
    setPhone("");
    setMessage("");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="max-w-2xl">
        <p className="eyebrow">Come say hello</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Visit the bakehouse</h1>
        <p className="mt-4 text-muted-foreground">
          We're on Ngong Road, just past the shopping centre, with parking at the
          back. Walk in for whatever is on the shelf, or message us to reserve.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          {[
            {
              icon: MapPin,
              title: "Ngong Road, Nairobi",
              body: "Kindaruma Lane junction — look for the terracotta door.",
            },
            {
              icon: Clock,
              title: "Opening hours",
              body: "Mon – Sat, 7:00 AM – 7:00 PM · Sun, 8:00 AM – 3:00 PM",
            },
            { icon: Phone, title: "Call the counter", body: BAKERY_PHONE },
            {
              icon: Mail,
              title: "Email",
              body: "hello@tehilaroyalkitchen.co.ke",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                <item.icon className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                </div>
              </div>
            </Reveal>
          ))}

          <Button asChild size="lg" variant="outline" className="w-full rounded-full">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <MessageCircle className="size-4" />
              Order on WhatsApp
            </a>
          </Button>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl">Send us a message</h2>
          <div className="mt-5 space-y-4">
            <div>
              <Label htmlFor="c-name">Your name</Label>
              <Input
                id="c-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Wanjiku M."
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="c-phone">Phone (optional)</Label>
              <Input
                id="c-phone"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0723 574 088"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="c-message">Message</Label>
              <Textarea
                id="c-message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Do you cater for office breakfasts?"
                className="mt-1.5"
              />
            </div>
            <Button size="lg" className="w-full rounded-full" onClick={send}>
              Send message
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
