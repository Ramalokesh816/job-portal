import { useState } from "react";
import { setUser } from "../services/auth";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setUser({ name: "User", email });
    window.location.href = "/";
  };

  return (
    <form className="auth" onSubmit={submit}>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" required />
      <button>Login</button>
    </form>
  );
}

export default Login;
