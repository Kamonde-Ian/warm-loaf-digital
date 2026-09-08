import { createFileRoute } from "@tanstack/react-router";

/**
 * M-Pesa payment result endpoint.
 *
 * Daraja posts here as `CallBackURL` once the customer finishes (or cancels)
 * the STK prompt. Until live Daraja keys are added, the checkout page posts a
 * simulated result in the same shape so payment status still flows end to end.
 * The order code and phone number must match a real order.
 */
export const Route = createFileRoute("/api/public/mpesa-callback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown> = {};
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return Response.json({ ResultCode: 1, ResultDesc: "Bad body" }, { status: 400 });
        }

        const stk = (body["Body"] as { stkCallback?: Record<string, unknown> } | undefined)
          ?.stkCallback;
        const metadata =
          (stk?.["CallbackMetadata"] as { Item?: { Name: string; Value?: unknown }[] })
            ?.Item ?? [];
        const metaValue = (name: string) =>
          metadata.find((i) => i.Name === name)?.Value;

        const code = String(body["code"] ?? stk?.["AccountReference"] ?? "");
        const phone = String(body["phone"] ?? metaValue("PhoneNumber") ?? "");
        const resultCode = Number(body["resultCode"] ?? stk?.["ResultCode"] ?? 1);
        const receipt = String(
          body["receipt"] ?? metaValue("MpesaReceiptNumber") ?? "",
        );

        if (!/^TMU-\d{4}$/.test(code) || !/^254(7|1)\d{8}$/.test(phone)) {
          return Response.json(
            { ResultCode: 1, ResultDesc: "Unknown order" },
            { status: 400 },
          );
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: order } = await supabaseAdmin
          .from("orders")
          .select("id, customer_phone, payment_status")
          .eq("code", code)
          .maybeSingle();

        if (!order || order.customer_phone !== phone) {
          return Response.json(
            { ResultCode: 1, ResultDesc: "Unknown order" },
            { status: 400 },
          );
        }
        if (order.payment_status === "paid") {
          return Response.json({ ResultCode: 0, ResultDesc: "Already settled" });
        }

        const { error } = await supabaseAdmin
          .from("orders")
          .update({
            payment_status: resultCode === 0 ? "paid" : "failed",
            mpesa_receipt: receipt || null,
          })
          .eq("id", order.id);
        if (error) {
          return Response.json({ ResultCode: 1, ResultDesc: "Update failed" }, { status: 500 });
        }

        return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
      },
    },
  },
});
