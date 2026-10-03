export const CASHFREE_CONFIG = {
  appId: process.env.CASHFREE_APP_ID || "",
  secretKey: process.env.CASHFREE_SECRET_KEY || "",
  env: (process.env.CASHFREE_ENV || "production") as "production" | "sandbox",
  apiVersion: "2023-08-01",
  get baseUrl() {
    return this.env === "production"
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";
  },
};

export interface CreateOrderParams {
  orderId: string;
  orderAmount: number;
  orderCurrency?: string;
  customerDetails: {
    customerId: string;
    customerName?: string;
    customerEmail: string;
    customerPhone: string;
  };
  returnUrl: string;
  notifyUrl?: string;
  orderNote?: string;
  orderTags?: Record<string, string>;
}

export interface CashfreeOrderResponse {
  cf_order_id: string;
  order_id: string;
  entity: string;
  order_currency: string;
  order_amount: number;
  order_status: "ACTIVE" | "PAID" | "EXPIRED";
  payment_session_id: string;
  order_expiry_time?: string;
  order_note?: string;
  order_tags?: Record<string, string>;
  customer_details: {
    customer_id: string;
    customer_name?: string | null;
    customer_email: string;
    customer_phone: string;
  };
}

/**
 * Sanitizes order_tags to strictly comply with Cashfree Payment Gateway constraints:
 * - Keys must be alphanumeric and underscores only, max 50 chars
 * - Values must not contain HTML, emojis, line breaks, or non-ASCII characters
 * - Values max length is 100 characters
 * - Maximum of 10 tags per order
 * - Reserved/problematic keys like 'brand_image' are filtered out
 */
export function sanitizeOrderTags(tags?: Record<string, string>): Record<string, string> | undefined {
  if (!tags || typeof tags !== "object") return undefined;

  const sanitized: Record<string, string> = {};
  const reservedKeys = new Set(["brand_image"]);

  for (const [key, value] of Object.entries(tags)) {
    if (!key || (typeof value !== "string" && typeof value !== "number")) continue;

    const cleanKey = String(key)
      .replace(/[^a-zA-Z0-9_]/g, "_")
      .slice(0, 50);

    if (!cleanKey || reservedKeys.has(cleanKey.toLowerCase())) continue;

    const cleanValue = String(value)
      .replace(/<[^>]*>/g, "") // strip HTML tags
      .replace(/[\r\n\t]+/g, " ") // replace newlines/tabs with space
      .replace(/[^\x20-\x7E]/g, "") // remove emojis & non-ASCII characters
      .trim()
      .slice(0, 100);

    if (cleanValue.length > 0) {
      sanitized[cleanKey] = cleanValue;
    }

    if (Object.keys(sanitized).length >= 10) break;
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

export function sanitizeOrderNote(note?: string): string {
  if (!note) return "Role Nest Contribution";
  return (
    String(note)
      .replace(/<[^>]*>/g, "")
      .replace(/[\r\n\t]+/g, " ")
      .replace(/₹/g, "INR ")
      .replace(/[^\x20-\x7E]/g, "")
      .trim()
      .slice(0, 200) || "Role Nest Contribution"
  );
}

/**
 * Creates a Cashfree payment order and returns the payment_session_id
 */
export async function createCashfreeOrder(params: CreateOrderParams): Promise<CashfreeOrderResponse> {
  const url = `${CASHFREE_CONFIG.baseUrl}/orders`;

  const payload: any = {
    order_id: params.orderId,
    order_amount: Number(params.orderAmount.toFixed(2)),
    order_currency: params.orderCurrency || "INR",
    customer_details: {
      customer_id: params.customerDetails.customerId,
      customer_name: params.customerDetails.customerName || "Candidate",
      customer_email: params.customerDetails.customerEmail,
      customer_phone: params.customerDetails.customerPhone || "9876543210",
    },
    order_meta: {
      return_url: params.returnUrl,
      notify_url: params.notifyUrl || undefined,
    },
    order_note: sanitizeOrderNote(params.orderNote),
  };

  const cleanTags = sanitizeOrderTags(params.orderTags);
  if (cleanTags) {
    payload.order_tags = cleanTags;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-client-id": CASHFREE_CONFIG.appId,
      "x-client-secret": CASHFREE_CONFIG.secretKey,
      "x-api-version": CASHFREE_CONFIG.apiVersion,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[Cashfree Create Order Error ${res.status}]:`, errorText);
    throw new Error(`Cashfree order creation failed: ${errorText}`);
  }

  return await res.json();
}

/**
 * Fetches order details directly from Cashfree to verify payment status
 */
export async function getCashfreeOrder(orderId: string): Promise<CashfreeOrderResponse> {
  const url = `${CASHFREE_CONFIG.baseUrl}/orders/${encodeURIComponent(orderId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "x-client-id": CASHFREE_CONFIG.appId,
      "x-client-secret": CASHFREE_CONFIG.secretKey,
      "x-api-version": CASHFREE_CONFIG.apiVersion,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[Cashfree Get Order Error ${res.status}]:`, errorText);
    throw new Error(`Failed to fetch Cashfree order status: ${errorText}`);
  }

  return await res.json();
}
