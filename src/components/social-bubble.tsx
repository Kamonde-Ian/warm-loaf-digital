import {
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Music2,
  Send,
  Share2,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/mpesa";

const links = [
  {
    label: "WhatsApp",
    icon: MessageCircle,
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
  { label: "Instagram", icon: Instagram, href: "https://instagram.com/tehilaroyalkitchen" },
  { label: "Facebook", icon: Facebook, href: "https://facebook.com/tehilaroyalkitchen" },
  { label: "TikTok", icon: Music2, href: "https://tiktok.com/@tehilaroyalkitchen" },
  { label: "X (Twitter)", icon: Twitter, href: "https://x.com/tehilakitchen" },
  { label: "YouTube", icon: Youtube, href: "https://youtube.com/@tehilaroyalkitchen" },
  { label: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/tehilaroyalkitchen" },
  { label: "Telegram", icon: Send, href: "https://t.me/tehilaroyalkitchen" },
] as const;

export function SocialBubble() {
  const [open, setOpen] = useState(false);

  return (
    <div className="floating-side fixed bottom-24 right-5 z-40 flex flex-col items-end gap-2">
      {open &&
        links.map((l, i) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={l.label}
            title={l.label}
            className="flex size-10 animate-scale-in items-center justify-center rounded-full border border-border bg-card text-foreground shadow-warm transition-colors hover:bg-primary hover:text-primary-foreground"
            style={{ animationDelay: `${i * 35}ms` }}
          >
            <l.icon className="size-[1.05rem]" />
          </a>
        ))}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Hide social links" : "Show social links"}
        className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift transition-transform hover:-translate-y-1"
      >
        {open ? <X className="size-5" /> : <Share2 className="size-5" />}
      </button>
    </div>
  );
}
