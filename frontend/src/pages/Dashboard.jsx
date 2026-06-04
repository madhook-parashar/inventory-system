import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    total_products: 0,
    total_customers: 0,
    total_orders: 0,
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/dashboard")
      .then((res) => setStats(res.data));
  }, []);

  const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    width: "220px",
    textAlign: "center",
    margin: "10px",
    fontSize: "20px",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Inventory Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={cardStyle}>
          <h3>Products</h3>
          <p>{stats.total_products}</p>
        </div>

        <div style={cardStyle}>
          <h3>Customers</h3>
          <p>{stats.total_customers}</p>
        </div>

        <div style={cardStyle}>
          <h3>Orders</h3>
          <p>{stats.total_orders}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;