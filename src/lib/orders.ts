import type { CartItem } from "./cart";

/**
 * Local order store (placeholder).
 * SUPABASE: replace with `orders` + `order_items` tables and RLS so customers
 * only read their own orders while staff (admin role) read all of them.
 */

export type PaymentStatus = "pending" | "paid" | "failed" | "cash_on_delivery";

export type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  fulfilment: "delivery" | "pickup";
  customer: {
    name: string;
    phone: string;
    area?: string;
    address?: string;
    note?: string;
  };
  paymentMethod: "mpesa" | "card" | "cod";
  paymentStatus: PaymentStatus;
  mpesaRef?: string;
  total: number;
  readyAt: string;
};

const KEY = "tamu-orders-v1";

const seedOrders: Order[] = [
  {
    id: "TMU-4821",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    items: [
      { id: "s1", name: "Country Sourdough", price: 550, qty: 2 },
      { id: "s2", name: "Cardamom Mandazi", price: 200, qty: 3 },
    ],
    fulfilment: "delivery",
    customer: { name: "Achieng O.", phone: "+254712000111", area: "Kilimani" },
    paymentMethod: "mpesa",
    paymentStatus: "paid",
    mpesaRef: "SJK4H8T2QP",
    total: 2000,
    readyAt: "Today, 4:30 PM",
  },
  {
    id: "TMU-4822",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    items: [{ id: "s3", name: "Custom Celebration Cake", price: 6500, qty: 1 }],
    fulfilment: "pickup",
    customer: { name: "Brian K.", phone: "+254733000222" },
    paymentMethod: "mpesa",
    paymentStatus: "pending",
    total: 6500,
    readyAt: "Sat, 11:00 AM",
  },
];

export function listOrders(): Order[] {
  if (typeof window === "undefined") return seedOrders;
  try {
    const raw = localStorage.getItem(KEY);
    const saved = raw ? (JSON.parse(raw) as Order[]) : [];
    return [...saved, ...seedOrders];
  } catch {
    return seedOrders;
  }
}

export function getOrder(id: string): Order | undefined {
  return listOrders().find((o) => o.id === id);
}

export function saveOrder(order: Order) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    const saved = raw ? (JSON.parse(raw) as Order[]) : [];
    localStorage.setItem(KEY, JSON.stringify([order, ...saved].slice(0, 40)));
  } catch {
    /* ignore quota errors */
  }
}

export const newOrderId = () =>
  `TMU-${Math.floor(1000 + Math.random() * 8999)}`;
