import { useEffect, useState } from "react";
import axios from "axios";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const fetchCustomers = async () => {
    const res = await axios.get("http://127.0.0.1:8000/customers");
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const addCustomer = async () => {
    await axios.post("http://127.0.0.1:8000/customers", null, {
      params: {
        name,
        email,
        phone,
      },
    });

    setName("");
    setEmail("");
    setPhone("");

    fetchCustomers();
  };

  const deleteCustomer = async (id) => {
    await axios.delete(
      `http://127.0.0.1:8000/customers/${id}`
    );

    fetchCustomers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customers</h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={addCustomer}>
        Add Customer
      </button>

      <br />
      <br />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                <button
                  onClick={() =>
                    deleteCustomer(customer.id)
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

export default Customers;