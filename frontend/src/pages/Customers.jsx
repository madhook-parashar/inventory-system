import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCustomers = async () => {
    const res = await axios.get(`${API}/customers/`);
    setCustomers(res.data);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const clearForm = () => {
    setFullName(""); setEmail(""); setPhone("");
    setError(""); setSuccess("");
  };

  const addCustomer = async () => {
    try {
      await axios.post(`${API}/customers/`, { full_name: fullName, email, phone });
      setSuccess("Customer added!"); clearForm(); fetchCustomers();
    } catch (e) { setError(e.response?.data?.detail || "Error adding customer"); }
  };

  const deleteCustomer = async (id) => {
    await axios.delete(`${API}/customers/${id}`);
    fetchCustomers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customers</h1>
      <h2>Add Customer</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={addCustomer}>Add Customer</button>
      <br /><br />
      <table border="1" cellPadding="10">
        <thead>
          <tr><th>ID</th><th>Full Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td><td>{c.full_name}</td>
              <td>{c.email}</td><td>{c.phone}</td>
              <td><button onClick={() => deleteCustomer(c.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;