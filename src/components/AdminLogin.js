import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Admin.css";

function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    try {

      const res = await API.post("/api/admin/login", {
        email,
        password
      });

      if (res.data === "Login success") {

        localStorage.setItem("admin", "true");

        alert("Login Successful ✅");

        navigate("/admin-dashboard");

      } else {

        alert(res.data);

      }

    } catch (err) {

      console.error(err);
      alert("Server Error ❌");

    }
  };

  return (
    <div className="admin-page">

      <h2>Admin Login</h2>

      <form onSubmit={login}>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  );
}

export default AdminLogin;
