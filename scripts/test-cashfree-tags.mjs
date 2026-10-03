// scripts/test-cashfree-tags.mjs
import { CASHFREE_CONFIG, createCashfreeOrder } from '../apps/web/lib/cashfree.ts';

const testCases = [
  {
    name: 'Current tags with special characters',
    tags: {
      plan: 'donation',
      planName: 'Community Support Donation (RitualDev & Role Nest)',
      planDurationMs: '0',
      userId: 'guest_123',
      userEmail: 'donor@gmail.com',
      customerPhone: '9876543210',
      community: 'RitualDev & Role Nest',
    }
  },
  {
    name: 'Sanitized alphanumeric tags',
    tags: {
      plan: 'donation',
      user_id: 'guest_123',
      donor_email: 'donor@gmail.com',
      donor_phone: '9876543210',
    }
  },
  {
    name: 'Empty tags',
    tags: undefined
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
