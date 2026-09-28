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
    order_note: params.orderNote || "Role Nest Pro",
  };

  if (params.orderTags) {
    payload.order_tags = params.orderTags;
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
