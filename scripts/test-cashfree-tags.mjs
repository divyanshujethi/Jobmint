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

async function run() {
  for (const tc of testCases) {
    console.log(`\nTesting: ${tc.name}`);
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
        orderTags: tc.tags
      });
      console.log('SUCCESS! order_id:', order.order_id);
    } catch (err) {
      console.log('FAILED:', err.message);
    }
  }
}

run();
