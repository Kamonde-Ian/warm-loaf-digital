import type { PaymentStatus } from "@/lib/orders";

export const statusStyle: Record<PaymentStatus, string> = {
  paid: "bg-primary text-primary-foreground",
  pending: "bg-accent text-accent-foreground",
  failed: "bg-destructive text-destructive-foreground",
  cash_on_delivery: "bg-secondary text-secondary-foreground",
};
