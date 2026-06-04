import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const fetchData = async () => {
    const customersRes = await axios.get(
      "http://127.0.0.1:8000/customers"
    );

    const productsRes = await axios.get(
      "http://127.0.0.1:8000/products"
    );

    const ordersRes = await axios.get(
      "http://127.0.0.1:8000/orders"
    );

    setCustomers(customersRes.data);
    setProducts(productsRes.data);
    setOrders(ordersRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createOrder = async () => {
    await axios.post(
      "http://127.0.0.1:8000/orders",
      null,
      {
        params: {
          customer_id: customerId,
          product_id: productId,
          quantity: quantity,
        },
      }
    );

    setQuantity("");
    fetchData();
  };

  const deleteOrder = async (id) => {
    await axios.delete(
      `http://127.0.0.1:8000/orders/${id}`
    );

    fetchData();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Orders</h1>

      <select
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
      >
        <option value="">Select Customer</option>

        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      >
        <option value="">Select Product</option>

        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <button onClick={createOrder}>
        Create Order
      </button>

      <br />
      <br />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer ID</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customer_id}</td>
              <td>{o.product_id}</td>
              <td>{o.quantity}</td>
              <td>{o.total_price}</td>
              <td>
                <button
                  onClick={() =>
                    deleteOrder(o.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;