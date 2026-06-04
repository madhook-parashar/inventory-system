import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "20px", background: "#222" }}>
      <Link to="/" style={{ color: "white", marginRight: "20px" }}>
        Dashboard
      </Link>

      <Link to="/products" style={{ color: "white", marginRight: "20px" }}>
        Products
      </Link>

      <Link to="/customers" style={{ color: "white", marginRight: "20px" }}>
        Customers
      </Link>

      <Link to="/orders" style={{ color: "white" }}>
        Orders
      </Link>
    </nav>
  );
}

export default Navbar;