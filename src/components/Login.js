import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser } from "../services/auth";
import "./Auth.css";

function Login({ setUser: setAppUser }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  // Login with Email & Password
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

    // Check password
    if (foundUser.password !== password) {
      setError("Wrong password ❌");
      return;
    }

    // Clear error
    setError("");

    const user = {
      name: foundUser.name,
      email: foundUser.email
    };

    // Save login
    setUser(user);       // localStorage
    setAppUser(user);    // React state

    // Go to Profile
    navigate("/profile");
  };

  // Fake Google Login
  const googleLogin = () => {
    setShowPopup(true);
  };

  // Fake Facebook Login
  const facebookLogin = () => {
    setShowPopup(true);
  };

  return (
    <div className="login-page">

      {/* ERROR POPUP (Google/Facebook) */}
      {showPopup && (
        <div className="popup-bg">

          <div className="popup-box">

            <h3>localhost:3000 says</h3>

            <p>Google login failed ❌</p>

            <button onClick={() => setShowPopup(false)}>
              OK
            </button>

          </div>

        </div>
      )}

      <div className="login-box">

        {/* LEFT PANEL */}
        <div className="login-left">

          <h2>Sign in</h2>

          {/* CREATE ACCOUNT */}
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
              <p style={{
                color: "red",
                fontSize: "13px",
                marginTop: "5px"
              }}>
                {error}
              </p>
            )}

            <button type="submit">
              Sign in
            </button>

          </form>

          {/* SOCIAL LOGIN */}
          <div className="social-login">

            <button
              className="google"
              type="button"
              onClick={googleLogin}
            >
              Continue with Google
            </button>

            <button
              className="facebook"
              type="button"
              onClick={facebookLogin}
            >
              Continue with Facebook
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
