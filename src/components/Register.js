import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: ""
  });

  // Password validation
  const isStrongPassword = (password) => {

    // At least 1 uppercase, 1 number, 1 special, 8 chars
    const pattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return pattern.test(password);
  };

  const submit = (e) => {
    e.preventDefault();

    // Get existing users
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    // Check duplicate email
    const emailExists = users.find(
      (u) => u.email === form.email
    );

    if (emailExists) {
      alert("Email already registered ❌");
      return;
    }

    // Check password strength
    if (!isStrongPassword(form.password)) {
      alert(
        "Password must contain:\n" +
        "- 1 Uppercase\n" +
        "- 1 Number\n" +
        "- 1 Special Symbol\n" +
        "- Min 8 characters"
      );
      return;
    }

    // Save new user
    const newUser = {
      name: form.name,
      email: form.email,
      password: form.password,
      mobile: form.mobile
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully ✅");

    // Go to login
    navigate("/login");
  };

  return (
    <div className="login-page">

      <div className="login-box">

        <div className="login-left">

          <h2>Register</h2>

          <p>
            Already have an account?
            <span onClick={() => navigate("/login")}>
              {" "}Login
            </span>
          </p>

          <form onSubmit={submit}>

            <input
              type="text"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Mobile Number"
              required
              value={form.mobile}
              onChange={(e) =>
                setForm({ ...form, mobile: e.target.value })
              }
            />

            <button type="submit">
              Register
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

export default Register;
