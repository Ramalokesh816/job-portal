import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser } from "../services/auth";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import "./Auth.css";

function Login({ setUser: setAppUser }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();


  /* ================= EMAIL LOGIN ================= */

  const submit = (e) => {
    e.preventDefault();

    // Get registered users
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    // Find user
    const foundUser = users.find(
      (u) => u.email === email
    );

    if (!foundUser) {
      setError("User not found ❌");
      return;
    }

    if (foundUser.password !== password) {
      setError("Wrong password ❌");
      return;
    }

    setError("");

    const user = {
      name: foundUser.name,
      email: foundUser.email
    };

    // Save login
    setUser(user);
    setAppUser(user);

    navigate("/profile");
  };


  /* ================= GOOGLE LOGIN ================= */

  const googleLogin = async () => {
    try {

      const result = await signInWithPopup(auth, googleProvider);

      const user = {
        name: result.user.displayName,
        email: result.user.email
      };

      // Save user
      setUser(user);
      setAppUser(user);

      navigate("/profile");

    } catch (err) {

      console.log("Google Login Error:", err);
      setError("Google login failed ❌");

    }
  };


  return (
    <div className="login-page">

      <div className="login-box">


        {/* LEFT PANEL */}
        <div className="login-left">

          <h2>Sign in</h2>

          {/* REGISTER LINK */}
          <p>
            Don’t have an account?
            <span onClick={() => navigate("/register")}>
              {" "}Create now
            </span>
          </p>


          {/* LOGIN FORM */}
          <form onSubmit={submit}>

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />


            {/* ERROR MESSAGE */}
            {error && (
              <p
                style={{
                  color: "red",
                  fontSize: "13px",
                  marginTop: "5px"
                }}
              >
                {error}
              </p>
            )}

            <button type="submit">
              Sign in
            </button>

          </form>


          {/* GOOGLE LOGIN */}
          <div className="social-login">

            <button
              className="google"
              type="button"
              onClick={googleLogin}
            >
              Continue with Google
            </button>

          </div>

        </div>


        {/* RIGHT PANEL */}
        <div className="login-right">
          <div className="lock-circle">🔒</div>
        </div>

      </div>

    </div>
  );
}

export default Login;
