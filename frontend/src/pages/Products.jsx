import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProducts = async () => {
    const res = await axios.get(`${API}/products/`);
    setProducts(res.data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const clearForm = () => {
    setName(""); setSku(""); setPrice(""); setQuantity("");
    setEditingId(null); setError(""); setSuccess("");
  };

  const addProduct = async () => {
    try {
      await axios.post(`${API}/products/`, { name, sku, price: parseFloat(price), quantity: parseInt(quantity) });
      setSuccess("Product added!"); clearForm(); fetchProducts();
    } catch (e) { setError(e.response?.data?.detail || "Error adding product"); }
  };

  const updateProduct = async () => {
    try {
      await axios.put(`${API}/products/${editingId}`, { name, price: parseFloat(price), quantity: parseInt(quantity) });
      setSuccess("Product updated!"); clearForm(); fetchProducts();
    } catch (e) { setError(e.response?.data?.detail || "Error updating product"); }
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API}/products/${id}`);
    fetchProducts();
  };

  const editProduct = (p) => {
    setEditingId(p.id); setName(p.name); setSku(p.sku);
    setPrice(p.price); setQuantity(p.quantity); setError(""); setSuccess("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Products</h1>
      <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} disabled={!!editingId} />
      <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      {editingId ? (
        <>
          <button onClick={updateProduct}>Update Product</button>
          <button onClick={clearForm}>Cancel</button>
        </>
      ) : (
        <button onClick={addProduct}>Add Product</button>
      )}
      <br /><br />
      <table border="1" cellPadding="10">
        <thead>
          <tr><th>ID</th><th>Name</th><th>SKU</th><th>Price</th><th>Quantity</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td><td>{p.name}</td><td>{p.sku}</td>
              <td>{p.price}</td><td>{p.quantity}</td>
              <td>
                <button onClick={() => editProduct(p)}>Edit</button>
                <button onClick={() => deleteProduct(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;