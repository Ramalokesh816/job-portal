import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

import API from "../services/api";

import "./Auth.css";

function Login({ setUser }) {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  // NORMAL LOGIN
  const submit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/api/users/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔥 IMPORTANT
      setUser(res.data.user);

      alert("Login Successful ✅");

      navigate("/profile");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Login Failed ❌"
      );
    }
  };


  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {

    try {

      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      const res = await API.post(
        "/api/users/google-login",
        {
          name: user.displayName,
          email: user.email,
          provider: "google"
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔥 IMPORTANT
      setUser(res.data.user);

      alert("Google Login Successful ✅");

      navigate("/profile");

    } catch {

      alert("Google Login Failed ❌");
    }
  };


  return (
    <div className="login-page">

      <div className="login-box">

        <div className="login-left">

          <h2>Sign In</h2>

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

            <button type="submit">
              Login
            </button>

          </form>


          <div className="social-login">

            <p>OR</p>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="google-btn"
            >
              Continue with Google
            </button>

          </div>

        </div>


        <div className="login-right">
          <div className="lock-circle">🔒</div>
        </div>

      </div>

    </div>
  );
}

export default Login;
