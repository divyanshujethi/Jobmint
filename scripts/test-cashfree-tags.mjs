// scripts/test-cashfree-tags.mjs
import { CASHFREE_CONFIG, createCashfreeOrder } from '../apps/web/lib/cashfree.ts';

const testCases = [
  {
    name: 'with emoji in donorNote',
    tags: { plan: 'donation', donorNote: 'Thank you! ❤️' }
  },
  {
    name: 'with newline in donorNote',
    tags: { plan: 'donation', donorNote: 'Line 1\nLine 2' }
  },
  {
    name: 'with url in donorNote',
    tags: { plan: 'donation', donorNote: 'Check https://rolenest.in' }
  },
  {
    name: 'with HTML in donorNote',
    tags: { plan: 'donation', donorNote: '<b>Bold</b>' }
  },
  {
    name: 'with empty string value',
    tags: { plan: 'donation', donorNote: '' }
  },
  {
    name: 'with checkout_context reserved key',
    tags: { checkout_context: 'Test context' }
  },
  {
    name: 'with brand_image key http',
    tags: { brand_image: 'http://example.com/logo.png' }
  },
  {
    name: 'with brand_image key https',
    tags: { brand_image: 'https://example.com/logo.png' }
  },
  {
    name: 'with long text > 100 chars',
    tags: { plan: 'donation', note: 'A'.repeat(120) }
  }
];

function sanitizeOrderTags(tags) {
  if (!tags || typeof tags !== "object") return undefined;

  const sanitized = {};
  const entries = Object.entries(tags);

  for (const [key, value] of entries) {
    if (!key || (typeof value !== "string" && typeof value !== "number")) continue;

    const cleanKey = String(key)
      .replace(/[^a-zA-Z0-9_]/g, "_")
      .slice(0, 50);

    if (!cleanKey) continue;

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

async function run() {
  for (const tc of testCases) {
    console.log(`\nTesting with sanitizer: ${tc.name}`);
    const cleanedTags = sanitizeOrderTags(tc.tags);
    console.log('Sanitized tags:', cleanedTags);
    try {
      const order = await createCashfreeOrder({
        orderId: 'test_' + Date.now().toString(36),
        orderAmount: 10,
        customerDetails: {
          customerId: 'cust_test',
          customerEmail: 'test@example.com',
          customerPhone: '9876543210'
        },
        returnUrl: 'https://rolenest.in/payment/verify?order_id={order_id}',
        orderTags: cleanedTags
      });
      console.log('SUCCESS! order_id:', order.order_id);
    } catch (err) {
      console.log('FAILED:', err.message);
    }
  }
}

run();

