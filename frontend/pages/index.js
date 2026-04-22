import { useState, useEffect } from "react";

const API_URL = "https://pickle-tracker-frontend-backend.onrender.com";

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [date, setDate] = useState("");
  const [customer, setCustomer] = useState("");
  const [pickle, setPickle] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  }

  async function addOrder() {
    const total = weight * price;

    try {
      await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, customer, pickle, weight, price, total })
      });
      loadOrders();
      setDate(""); setCustomer(""); setPickle(""); setWeight(""); setPrice("");
    } catch (err) {
      console.error("Failed to add order:", err);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Pickle Delivery Tracker</h2>

      <input type="date" placeholder="Date" value={date} onChange={e => setDate(e.target.value)} />
      <input placeholder="Customer" value={customer} onChange={e => setCustomer(e.target.value)} />
      <input placeholder="Pickle" value={pickle} onChange={e => setPickle(e.target.value)} />
      <input placeholder="Weight" value={weight} onChange={e => setWeight(e.target.value)} />
      <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />

      <button onClick={addOrder}>Add</button>

      <table border="1" cellPadding="8" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Pickle</th>
            <th>Weight</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={i}>
              <td>{o.customer}</td>
              <td>{o.pickle}</td>
              <td>{o.weight}</td>
              <td>{o.price}</td>
              <td>{o.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}