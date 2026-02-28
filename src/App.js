import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Jobs from "./components/Jobs";
import Employers from "./components/Employers";
import PostJob from "./components/PostJob";
import Apply from "./components/ApplyJob";

/* ADMIN */
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ManageCompanies from "./components/ManageCompanies";
import AdminManageJobs from "./components/AdminManageJobs";

function App() {

  /* ================= USER STATE ================= */
  const [user, setUser] = useState(null);

  /* ================= ADMIN STATE (FIX) ================= */
  const [admin, setAdmin] = useState(
    localStorage.getItem("admin")
  );

  /* LOAD USER FROM STORAGE */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  /* LOAD ADMIN FROM STORAGE */
  useEffect(() => {
    setAdmin(localStorage.getItem("admin"));
  }, []);

  return (
    <>
      <Header user={user} setUser={setUser} />

      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/employers" element={<Employers />} />

        {/* ================= USER AUTH ================= */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/profile" /> : <Login setUser={setUser} />
          }
        />

        <Route
          path="/register"
          element={
            user ? <Navigate to="/profile" /> : <Register />
          }
        />

        {/* ================= USER PROTECTED ================= */}
        <Route
          path="/profile"
          element={
            user ? <Profile setUser={setUser} /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/apply"
          element={
            user ? <Apply /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/postjob"
          element={
            user ? <PostJob /> : <Navigate to="/login" />
          }
        />

        {/* ================= ADMIN ROUTES (FIXED) ================= */}
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin-dashboard"
          element={
            admin ? <AdminDashboard /> : <Navigate to="/admin-login" />
          }
        />

        <Route
          path="/manage-companies"
          element={
            admin ? <ManageCompanies /> : <Navigate to="/admin-login" />
          }
        />

        <Route
          path="/manage-jobs"
          element={
            admin ? <AdminManageJobs /> : <Navigate to="/admin-login" />
          }
        />

      </Routes>
    </>
  );
}

export default App;