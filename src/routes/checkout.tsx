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
import { newOrderId, saveOrder, type Order } from "@/lib/orders";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout & M-Pesa Payment — Tamu Bakehouse" },
      {
        name: "description",
        content:
          "Choose pickup on Ngong Road or delivery in Nairobi, then pay securely with an M-Pesa STK push prompt on your phone.",
      },
      { property: "og:title", content: "Checkout & M-Pesa Payment — Tamu Bakehouse" },
      {
        property: "og:description",
        content: "Pay for your bakery order with M-Pesa in a few taps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checkout;
});

function Checkout() {
  return null;
}
