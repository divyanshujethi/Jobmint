#!/bin/bash
echo "=== 1. Checking PM2 Process ==="
pm2 status

echo "=== 2. Checking /api/payment/donations/stats ==="
curl -s http://127.0.0.1:3000/api/payment/donations/stats
echo ""

echo "=== 3. Checking donation.rolenest.in Header Isolation ==="
RESP=$(curl -s -H "Host: donation.rolenest.in" -H "X-Is-Donation: 1" http://127.0.0.1/)

echo "Checking if Job Board Navbar ('Explore Jobs') exists in donation page response:"
if echo "$RESP" | grep -q "Explore Jobs"; then
  echo "FAIL: Found 'Explore Jobs' in donation response"
else
  echo "SUCCESS: 'Explore Jobs' navbar NOT found in donation response"
fi

echo "Checking if DPDP Act text exists in donation page response:"
if echo "$RESP" | grep -q "DPDP"; then
  echo "SUCCESS: DPDP Act compliance text present"
else
  echo "FAIL: DPDP Act compliance text not found"
fi

echo "Checking if RitualDev Lab, Role Nest, and DevShelf are present:"
if echo "$RESP" | grep -q "RitualDev Lab" && echo "$RESP" | grep -q "Role Nest" && echo "$RESP" | grep -q "DevShelf"; then
  echo "SUCCESS: All 3 entities (RitualDev Lab, Role Nest, DevShelf) are present"
else
  echo "Entity check summary:"
  echo "$RESP" | grep -o "RitualDev Lab" | head -n 1
  echo "$RESP" | grep -o "Role Nest" | head -n 1
  echo "$RESP" | grep -o "DevShelf" | head -n 1
fi

echo "Checking if Fake Target ('24,350') is absent:"
if echo "$RESP" | grep -q "24,350"; then
  echo "FAIL: Fake target still found"
else
  echo "SUCCESS: Fake target removed"
fi
