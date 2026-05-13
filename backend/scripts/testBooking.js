async function testBooking() {
  try {
    const res = await fetch('http://localhost:5000/api/inventory/66360c78e352b220b33b9347/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Test User",
        phone: "1234567890",
        email: "test@example.com"
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.log("Fetch Error:", err.message);
  }
}

testBooking();
