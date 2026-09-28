async function test() {
  const res = await fetch("https://rolenest.in/pricing");
  const html = await res.text();
  console.log("Status:", res.status);
  console.log("Contains 'For Candidates & Developers':", html.includes("For Candidates &amp; Developers") || html.includes("For Candidates & Developers"));
  console.log("Contains 'Hire Verified Developers Fast':", html.includes("Hire Verified Developers Fast"));
}
test().catch(console.error);
