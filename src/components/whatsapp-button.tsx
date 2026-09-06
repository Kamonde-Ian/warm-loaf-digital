import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/mpesa";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Tamu Bakehouse! I'd like to place an order.")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat to order on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-cocoa px-4 py-3 text-sm font-semibold text-cocoa-foreground shadow-lift transition-transform hover:-translate-y-1"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">Chat to order</span>
    </a>
  );
}
