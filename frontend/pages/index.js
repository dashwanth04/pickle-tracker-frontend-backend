import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  }

  async function addOrder() {

    if (!formData.pickle || !formData.price) {
      alert("Please select pickle and enter price");
      return;
    }

    const total = parseFloat(formData.price);

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

    if (!confirm("Delete this order?")) return;

    try {

      await fetch(`${API_URL}/orders/${id}`, {
        method: "DELETE"
      });

      loadOrders();

    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  const filteredOrders = orders.filter((order) => {

    return (
      (order.customer || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (filterDate === "" || order.date === filterDate) &&
      (filterPickle === "" || order.pickle === filterPickle)
    );

  });

  const totalSales = filteredOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  /* ----------- SALES GRAPH DATA ----------- */

  const salesByDate = {};

  filteredOrders.forEach(order => {

    const date = order.date;

    if (!salesByDate[date]) {
      salesByDate[date] = 0;
    }

    salesByDate[date] += Number(order.total);

  });

  const chartData = {
    labels: Object.keys(salesByDate),
    datasets: [
      {
        label: "Daily Sales ₹",
        data: Object.values(salesByDate),
        backgroundColor: "#4facfe"
      }
    ]
  };

  return (

    <div style={styles.page}>

      <div style={styles.container}>

        <h2 style={styles.header}>🥒 Pickle Delivery Tracker</h2>

        {/* FILTERS */}

        <div style={styles.searchFilter}>

          <input
            type="text"
            placeholder="🔎 Search Customer"
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

            <option value="ఆవకాయ">ఆవకాయ</option>
            <option value="మాగాయ">మాగాయ</option>
            <option value="టమాటో">టమాటో</option>
            <option value="నిమ్మకాయ">నిమ్మకాయ</option>
            <option value="మిర్చి">మిర్చి</option>
            <option value="అల్లం">అల్లం</option>
            <option value="చికెన్">చికెన్</option>
            <option value="రొయ్యలు">రొయ్యలు</option>
            <option value="పాల కోవా">పాల కోవా</option>

          </select>

        </div>

        {/* INPUT FORM */}

        <div style={styles.inputCard}>

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

            <option value="">Pickle</option>

            <option value="ఆవకాయ">ఆవకాయ</option>
            <option value="మాగాయ">మాగాయ</option>
            <option value="టమాటో">టమాటో</option>
            <option value="నిమ్మకాయ">నిమ్మకాయ</option>
            <option value="మిర్చి">మిర్చి</option>
            <option value="అల్లం">అల్లం</option>
            <option value="చికెన్">చికెన్</option>
            <option value="రొయ్యలు">రొయ్యలు</option>
            <option value="పాల కోవా">పాల కోవా</option>

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
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            style={styles.input}
          />

          <button onClick={addOrder} style={styles.button}>
            ➕ Add Delivery
          </button>

        </div>

        {/* TABLE */}

        <div style={styles.tableWrapper}>

          <table style={styles.table}>

            <thead>

              <tr style={styles.thRow}>
                <th>Date</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Weight</th>
                <th>Price</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredOrders.map((o) => (

                <tr key={o._id} style={styles.row}>

                  <td>{o.date}</td>
                  <td>{o.customer}</td>
                  <td>{o.pickle}</td>
                  <td>{o.weight} kg</td>
                  <td>₹{o.total}</td>

                  <td>
                    <button
                      onClick={() => deleteOrder(o._id)}
                      style={styles.deleteBtn}
                    >
                      🗑 Delete
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* TOTAL SALES */}

        <div style={styles.totalSales}>
          📊 Total Sales: ₹{totalSales.toFixed(2)}
        </div>

        {/* SALES GRAPH */}

        <div style={styles.chartCard}>

          <h3 style={{marginBottom:10}}>📈 Daily Sales Graph</h3>

          <Bar data={chartData} />

        </div>

      </div>

    </div>

  );
}

const styles = {

  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#4facfe,#00f2fe)",
    padding: "20px"
  },

  container: {
    maxWidth: "1100px",
    margin: "auto",
    padding: "20px",
    background: "white",
    borderRadius: "18px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
  },

  header: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px"
  },

  searchFilter: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "20px"
  },

  inputCard: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
    gap: "10px",
    padding: "15px",
    background: "#f6f8ff",
    borderRadius: "12px",
    marginBottom: "25px"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%"
  },

  button: {
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg,#ff7e5f,#ff3f6c)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },

  tableWrapper: {
    overflowX: "auto"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
  },

  thRow: {
    background: "#2c3e50",
    color: "white"
  },

  row: {
    textAlign: "center",
    borderBottom: "1px solid #eee"
  },

  deleteBtn: {
    padding: "6px 12px",
    background: "#ff4d4d",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  totalSales: {
    marginTop: "25px",
    padding: "20px",
    background: "linear-gradient(135deg,#00b09b,#96c93d)",
    color: "white",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold"
  },

  chartCard: {
    marginTop: "30px",
    padding: "20px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
  }

};