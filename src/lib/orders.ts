/** Order shapes shared by the shop and the staff dashboard. */

export type PaymentStatus = "pending" | "paid" | "failed" | "cash_on_delivery";
export type Fulfilment = "delivery" | "pickup";
export type PaymentMethod = "mpesa" | "card" | "cod";

export type OrderLine = {
  id: string;
  name: string;
  unit?: string;
  qty: number;
  price: number;
  notes?: Record<string, string>;
};

export type Order = {
  id: string;
  code: string;
  createdAt: string;
  items: OrderLine[];
  fulfilment: Fulfilment;
  customer: {
    name: string;
    phone: string;
    area?: string;
    address?: string;
    note?: string;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  mpesaRef?: string;
  mpesaReceipt?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  readyAt: string;
};

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: "Payment pending",
  paid: "M-Pesa paid",
  failed: "Payment failed",
  cash_on_delivery: "Cash on delivery",
};

export const orderStatuses: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "cash_on_delivery",
];
