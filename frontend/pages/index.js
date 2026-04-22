import { useState, useEffect } from "react";

const API_URL = "https://pickle-tracker-frontend-backend.onrender.com";

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    customer: "",
    pickle: "",
    weight: "0.25",
    price: ""
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterPickle, setFilterPickle] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch(`${API_URL}/orders`);

      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  }

  async function addOrder() {
    if (!formData.customer || !formData.pickle || !formData.price) {
      alert("Please fill in all fields");
      return;
    }

    const total =
      parseFloat(formData.weight) * parseFloat(formData.price);

    try {
      await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...formData, total })
      });

      loadOrders();

      setFormData({
        date: "",
        customer: "",
        pickle: "",
        weight: "0.25",
        price: ""
      });
    } catch (err) {
      console.error("Failed to add order:", err);
    }
  }
  async function deleteOrder(id) {
  if (!confirm("Are you sure you want to delete this order?")) return;

  try {
    await fetch(`${API_URL}/orders/${id}`, {
      method: "DELETE"
    });

    loadOrders(); // refresh orders
  } catch (err) {
    console.error("Failed to delete order:", err);
  }
}

  const filteredOrders = orders.filter((order) => {
    return (
      order.customer
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (filterDate === "" || order.date === filterDate) &&
      (filterPickle === "" || order.pickle === filterPickle)
    );
  });

  const totalSales = filteredOrders.reduce(
    (sum, order) => sum + parseFloat(order.total || 0),
    0
  );

  const exportToCSV = () => {
    const headers = "Date,Customer,Pickle,Weight,Price,Total\n";

    const rows = filteredOrders
      .map(
        (o) =>
          `${o.date},${o.customer},${o.pickle},${o.weight},${o.price},${o.total}`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "pickle_orders.csv";
    a.click();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🥒 Pickle Delivery Tracker</h2>

      <div style={styles.searchFilter}>
        <input
          type="text"
          placeholder="Search Customer"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />

        <input
          type="date"
          onChange={(e) => setFilterDate(e.target.value)}
          style={styles.input}
        />

        <select
          onChange={(e) => setFilterPickle(e.target.value)}
          style={styles.input}
        >
          <option value="">All Pickles</option>

          <optgroup label="Veg">
            <option value="Mango">Mango</option>
            <option value="Lemon">Lemon</option>
            <option value="Garlic">Garlic</option>
          </optgroup>

          <optgroup label="Non-Veg">
            <option value="Chicken">Chicken</option>
            <option value="Prawns">Prawns</option>
          </optgroup>
        </select>

        <button onClick={exportToCSV} style={styles.exportBtn}>
          Export CSV
        </button>
      </div>

      <div style={styles.inputGroup}>
        <input
          type="date"
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
          style={styles.input}
        />

        <input
          placeholder="Customer Name"
          value={formData.customer}
          onChange={(e) =>
            setFormData({ ...formData, customer: e.target.value })
          }
          style={styles.input}
        />

        <select
          value={formData.pickle}
          onChange={(e) =>
            setFormData({ ...formData, pickle: e.target.value })
          }
          style={styles.input}
        >
          <option value="">Select Pickle</option>
          <option value="Mango">Mango</option>
          <option value="Chicken">Chicken</option>
          <option value="Lemon">Lemon</option>
          <option value="Prawns">Prawns</option>
        </select>

        <select
          value={formData.weight}
          onChange={(e) =>
            setFormData({ ...formData, weight: e.target.value })
          }
          style={styles.input}
        >
          <option value="0.25">250 g</option>
          <option value="0.5">500 g</option>
          <option value="1">1 kg</option>
        </select>

        <input
          type="number"
          placeholder="Price per kg"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          style={styles.input}
        />

        <button onClick={addOrder} style={styles.button}>
          Add Delivery
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr style={styles.thRow}>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Customer</th>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>Weight</th>
            <th style={styles.th}>Total</th>
          </tr>
        </thead>

       <tbody>
  {filteredOrders.map((o) => (
    <tr key={o._id}>
      <td style={styles.td}>{o.date}</td>
      <td style={styles.td}>{o.customer}</td>
      <td style={styles.td}>{o.pickle}</td>
      <td style={styles.td}>{o.weight} kg</td>
      <td style={styles.td}>₹{o.total}</td>
      <td style={styles.td}>
        <button
          onClick={() => deleteOrder(o._id)}
          style={styles.deleteBtn}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>

      <div style={styles.totalSales}>
        <h3>Total Sales: ₹{totalSales.toFixed(2)}</h3>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "20px auto",
    padding: "30px",
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', sans-serif"
  },
  header: {
    textAlign: "center",
    color: "#333",
    marginBottom: "25px"
  },
  inputGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "20px"
  },
  searchFilter: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
    background: "#f0f0f0",
    padding: "15px",
    borderRadius: "8px"
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px"
  },
  button: {
    padding: "10px 20px",
    background: "#333",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  exportBtn: {
    padding: "10px 20px",
    background: "#4a90a4",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px"
  },
  thRow: {
    background: "#333",
    color: "white"
  },
  th: {
    padding: "12px"
  },
  td: {
    padding: "12px",
    textAlign: "center",
    borderBottom: "1px solid #ddd"
  },
  totalSales: {
    marginTop: "20px",
    padding: "20px",
    background: "#333",
    color: "white",
    borderRadius: "8px",
    textAlign: "center"
  }
};