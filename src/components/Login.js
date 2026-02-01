import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Login({ setUser: setAppUser }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();


  /* ================= LOGIN ================= */

  const submit = async (e) => {
    e.preventDefault();

    try {

      const res = await API.post("/api/users/login", {
        email,
        password
      });

      if (res.data === "Login Successful") {

        const user = {
          email
        };

        // Save logged user
        localStorage.setItem("user", JSON.stringify(user));

        setAppUser(user);

        navigate("/profile");

      } else {

        setError("Invalid Credentials ❌");

      }

    } catch (err) {

      console.log("Login Error:", err);
      setError("Server Error ❌");

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
              onChange={e => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />


            {error && (
              <p style={{ color: "red", fontSize: "13px" }}>
                {error}
              </p>
            )}

            <button type="submit">
              Sign in
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
