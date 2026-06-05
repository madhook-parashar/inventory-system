import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Dashboard() {
  const [stats, setStats] = useState({
    total_products: 0,
    total_customers: 0,
    total_orders: 0,
    low_stock_products: [],
  });

  useEffect(() => {
    axios.get(`${API}/dashboard`).then((res) => setStats(res.data));
  }, []);

  const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    width: "200px",
    textAlign: "center",
    margin: "10px",
    fontSize: "20px",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Inventory Dashboard</h1>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={cardStyle}><h3>Products</h3><p>{stats.total_products}</p></div>
        <div style={cardStyle}><h3>Customers</h3><p>{stats.total_customers}</p></div>
        <div style={cardStyle}><h3>Orders</h3><p>{stats.total_orders}</p></div>
      </div>

      <br />
      <h2>Low Stock Products</h2>
      {stats.low_stock_products.length === 0 ? (
        <p>No low stock products.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr><th>ID</th><th>Name</th><th>SKU</th><th>Quantity</th></tr>
          </thead>
          <tbody>
            {stats.low_stock_products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td><td>{p.name}</td><td>{p.sku}</td><td>{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;