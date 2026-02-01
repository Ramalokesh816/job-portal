import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Login({ setUser: setAppUser }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  /* ================= LOGIN ================= */

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const res = await API.post("/api/users/login", {
        email,
        password
      });

      // backend returns user object
      const user = res.data;

      // save session
      localStorage.setItem("user", JSON.stringify(user));

      setAppUser(user);

      navigate("/profile");

    } catch (err) {

      console.log("Login Error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid credentials ❌");
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">

      <div className="login-box">

        <div className="login-left">

          <h2>Sign in</h2>

          <p>
            Don’t have an account?
            <span onClick={() => navigate("/register")}>
              {" "}Create now
            </span>
          </p>


          <form onSubmit={submit}>

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />


            {error && (
              <p style={{ color: "red", fontSize: "13px" }}>
                {error}
              </p>
            )}


            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

        </div>


        <div className="login-right">
          <div className="lock-circle">🔒</div>
        </div>

      </div>

    </div>
  );
}

export default Login;
