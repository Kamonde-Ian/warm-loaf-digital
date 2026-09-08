import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  Fulfilment,
  Order,
  OrderLine,
  PaymentMethod,
  PaymentStatus,
} from "./orders";

export const DELIVERY_FEE_KES = 300;

type OrderRow = {
  id: string;
  code: string;
  created_at: string;
  fulfilment: string;
  customer_name: string;
  customer_phone: string;
  area: string | null;
  address: string | null
  note: string | null;
  payment_method: string;
  payment_status: string;
  mpesa_ref: string | null;
  mpesa_receipt: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  ready_at: string;
  order_items?: ItemRow[] | null;
};

type ItemRow = {
  id: string;
  name: string;
  unit: string | null;
  qty: number;
  price: number;
  notes: unknown;
};

const SELECT =
  "id, code, created_at, fulfilment, customer_name, customer_phone, area, address, note, payment_method, payment_status, mpesa_ref, mpesa_receipt, subtotal, delivery_fee, total, ready_at, order_items ( id, name, unit, qty, price, notes )";

function mapItem(row: ItemRow): OrderLine {
  return {
    id: row.id,
    name: row.name,
    qty: row.qty,
    price: row.price,
    ...(row.unit ? { unit: row.unit } : {}),
    ...(row.notes && typeof row.notes === "object"
      ? { notes: row.notes as Record<string, string> }
      : {}),
  };
}

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    code: row.code,
    createdAt: row.created_at,
    items: (row.order_items ?? []).map(mapItem),
    fulfilment: row.fulfilment as Fulfilment,
    customer: {
      name: row.customer_name,
      phone: row.customer_phone,
      ...(row.area ? { area: row.area } : {}),
      ...(row.address ? { address: row.address } : {}),
      ...(row.note ? { note: row.note } : {}),
    },
    paymentMethod: row.payment_method as PaymentMethod,
    paymentStatus: row.payment_status as PaymentStatus,
    ...(row.mpesa_ref ? { mpesaRef: row.mpesa_ref } : {}),
    ...(row.mpesa_receipt ? { mpesaReceipt: row.mpesa_receipt } : {}),
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    total: row.total,
    readyAt: row.ready_at,
  };
}

type NewOrderInput = {
  items: {
    productId?: string;
    name: string;
    unit?: string;
    qty: number;
    price: number;
    notes?: Record<string, string>;
  }[];
  fulfilment: Fulfilment;
  customer: {
    name: string;
    phone: string;
    area?: string;
    address?: string;
    note?: string;
  };
  paymentMethod: PaymentMethod;
  readyAt: string;
  mpesaRef?: string;
};

function validateNewOrder(input: NewOrderInput): NewOrderInput {
  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new Error("An order needs at least one item.");
  }
  if (!input.customer?.name?.trim()) throw new Error("A name is required.");
  if (!/^254(7|1)\d{8}$/.test(input.customer.phone)) {
    throw new Error("A valid Safaricom number is required.");
  }
  if (input.fulfilment !== "delivery" && input.fulfilment !== "pickup") {
    throw new Error("Choose delivery or pickup.");
  }
  input.items.forEach((item) => {
    if (!item.name?.trim()) throw new Error("Each item needs a name.");
    if (!Number.isFinite(item.qty) || item.qty < 1 || item.qty > 200) {
      throw new Error("Item quantities look wrong.");
    }
    if (!Number.isFinite(item.price) || item.price < 0) {
      throw new Error("Item prices look wrong.");
    }
  });
  return input;
}

/** Public: places an order from the shop. Totals are recomputed server-side. */
export const createOrder = createServerFn({ method: "POST" })
  .inputValidator(validateNewOrder)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const subtotal = data.items.reduce((n, i) => n + i.qty * i.price, 0);
    const deliveryFee = data.fulfilment === "delivery" ? DELIVERY_FEE_KES : 0;
    const total = subtotal + deliveryFee;

    let code = "";
    let orderId = "";
    for (let attempt = 0; attempt < 6; attempt += 1) {
      code = `TMU-${Math.floor(1000 + Math.random() * 8999)}`;
      const { data: inserted, error } = await supabaseAdmin
        .from("orders")
        .insert({
          code,
          customer_name: data.customer.name.trim(),
          customer_phone: data.customer.phone,
          fulfilment: data.fulfilment,
          area: data.customer.area?.trim() ?? null,
          address: data.customer.address?.trim() ?? null,
          note: data.customer.note?.trim() ?? null,
          payment_method: data.paymentMethod,
          payment_status: data.paymentMethod === "cod" ? "cash_on_delivery" : "pending",
          mpesa_ref: data.mpesaRef ?? null,
          subtotal,
          delivery_fee: deliveryFee,
          total,
          ready_at: data.readyAt,
        })
        .select("id, code")
        .single();

      if (!error && inserted) {
        orderId = inserted.id;
        code = inserted.code;
        break;
      }
      if (error && error.code !== "23505") throw new Error(error.message);
    }
    if (!orderId) throw new Error("Could not create the order. Please try again.");

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
      data.items.map((item) => ({
        order_id: orderId,
        product_id: item.productId ?? null,
        name: item.name,
        unit: item.unit ?? null,
        qty: item.qty,
        price: item.price,
        notes: item.notes ?? null,
      })),
    );
    if (itemsError) throw new Error(itemsError.message);

    return { code, total, subtotal, deliveryFee };
  });

/** Public: a shopper looking up their own order with the code they were given. */
export const getOrderByCode = createServerFn({ method: "GET" })
  .inputValidator((input: { code: string }) => {
    if (!/^TMU-\d{4}$/.test(input.code ?? "")) throw new Error("Unknown order code.");
    return input;
  })
  .handler(async ({ data }): Promise<Order | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .select(SELECT)
      .eq("code", data.code)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? mapOrder(row as unknown as OrderRow) : null;
  });

/** Staff only: every order, newest first. */
export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Order[]> => {
    const { data, error } = await context.supabase
      .from("orders")
      .select(SELECT)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapOrder(row as unknown as OrderRow));
  });

/** Staff only: change an order's payment status by hand. */
export const setOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { code: string; status: PaymentStatus }) => {
    const allowed: PaymentStatus[] = ["pending", "paid", "failed", "cash_on_delivery"];
    if (!allowed.includes(input.status)) throw new Error("Unknown status.");
    if (!/^TMU-\d{4}$/.test(input.code ?? "")) throw new Error("Unknown order code.");
    return input;
  })
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("orders")
      .update({ payment_status: data.status })
      .eq("code", data.code);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
