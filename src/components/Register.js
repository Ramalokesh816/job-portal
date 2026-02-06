import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

import "./Auth.css";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });


  const submit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/api/users/register",
        {
          ...form,
          role: "USER"
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      alert("Registered Successfully ✅");

      navigate("/");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Register Failed ❌"
      );
    }
  };


  return (
    <div className="login-page">

      <div className="login-box">


        <div className="login-left">

          <h2>Register</h2>


          <form onSubmit={submit}>


            <input
              type="text"
              placeholder="Name"
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
            />


            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
            />


            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value
                })
              }
            />


            <input
              type="text"
              placeholder="Phone"
              required
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value
                })
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
