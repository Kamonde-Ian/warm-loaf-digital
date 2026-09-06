/**
 * M-Pesa Daraja integration point (placeholder).
 *
 * Production wiring:
 *  1. Create a server function (`src/lib/mpesa.functions.ts`) that reads
 *     DARAJA_CONSUMER_KEY / DARAJA_CONSUMER_SECRET / MPESA_SHORTCODE /
 *     MPESA_PASSKEY from process.env inside the handler.
 *  2. POST /oauth/v1/generate?grant_type=client_credentials to get a token.
 *  3. POST /mpesa/stkpush/v1/processrequest with BusinessShortCode,
 *     Password (base64 of shortcode+passkey+timestamp), Timestamp,
 *     TransactionType: "CustomerPayBillOnline", Amount, PartyA (phone),
 *     PartyB (shortcode), PhoneNumber, CallBackURL, AccountReference, TransactionDesc.
 *  4. Expose the callback at src/routes/api/public/mpesa-callback.ts and update
 *     the order's payment_status from the ResultCode (0 = success).
 */

export type StkPushResult = {
  ok: boolean;
  merchantRequestId: string;
  checkoutRequestId: string;
  customerMessage: string;
};

/** Normalises 07.., 7.., +2547.., 2547.. to Daraja's 2547XXXXXXXX format. */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (/^254(7|1)\d{8}$/.test(digits)) return digits;
  if (/^0(7|1)\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
  if (/^(7|1)\d{8}$/.test(digits)) return `254${digits}`;
  return null;
}

/** Simulated STK Push. Replace the body with the server-function call. */
export async function requestStkPush(input: {
  phone: string;
  amount: number;
  reference: string;
}): Promise<StkPushResult> {
  await new Promise((r) => setTimeout(r, 1400));
  return {
    ok: true,
    merchantRequestId: `MR-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    checkoutRequestId: `CR-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    customerMessage: `An M-Pesa prompt for KES ${input.amount.toLocaleString("en-KE")} was sent to ${input.phone}. Enter your PIN to pay for ${input.reference}.`,
  };
}

/** Simulated callback poll — resolves to the final payment status. */
export async function pollPaymentStatus(): Promise<"paid" | "failed"> {
  await new Promise((r) => setTimeout(r, 3200));
  return "paid";
}

export const MPESA_TILL = "247247";
export const WHATSAPP_NUMBER = "254712345678";
export const BAKERY_PHONE = "+254 712 345 678";
export const BAKERY_NAME = "Tamu Bakehouse";
