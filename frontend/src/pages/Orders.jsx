import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: "" }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAll = async () => {
    const [o, c, p] = await Promise.all([
      axios.get(`${API}/orders/`),
      axios.get(`${API}/customers/`),
      axios.get(`${API}/products/`),
    ]);
    setOrders(o.data);
    setCustomers(c.data);
    setProducts(p.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const addItem = () => setItems([...items, { product_id: "", quantity: "" }]);

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const createOrder = async () => {
    try {
      const payload = {
        customer_id: parseInt(customerId),
        items: items.map((i) => ({
          product_id: parseInt(i.product_id),
          quantity: parseInt(i.quantity),
        })),
      };
      await axios.post(`${API}/orders/`, payload);
      setSuccess("Order created!");
      setCustomerId("");
      setItems([{ product_id: "", quantity: "" }]);
      setError("");
      fetchAll();
    } catch (e) { setError(e.response?.data?.detail || "Error creating order"); }
  };

  const deleteOrder = async (id) => {
    await axios.delete(`${API}/orders/${id}`);
    fetchAll();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Orders</h1>
      <h2>Create Order</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
        <option value="">Select Customer</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
        ))}
      </select>

      <h3>Items</h3>
      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: "8px" }}>
          <select value={item.product_id} onChange={(e) => updateItem(index, "product_id", e.target.value)}>
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku}, Stock: {p.quantity})</option>
            ))}
          </select>
          <input
            placeholder="Quantity"
            value={item.quantity}
            onChange={(e) => updateItem(index, "quantity", e.target.value)}
            style={{ width: "80px", marginLeft: "8px" }}
          />
          {items.length > 1 && (
            <button onClick={() => removeItem(index)} style={{ marginLeft: "8px" }}>Remove</button>
          )}
        </div>
      ))}
      <button onClick={addItem}>+ Add Item</button>
      <br /><br />
      <button onClick={createOrder}>Create Order</button>

      <br /><br />
      <h2>All Orders</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr><th>ID</th><th>Customer ID</th><th>Total Amount</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td><td>{o.customer_id}</td>
              <td>${o.total_amount.toFixed(2)}</td><td>{o.status}</td>
              <td><button onClick={() => deleteOrder(o.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;