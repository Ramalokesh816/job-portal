import { Routes, Route } from "react-router-dom";
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
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ManageCompanies from "./components/ManageCompanies";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {

  const [user, setUser] = useState(null);


  // Load user after refresh
  useEffect(() => {

    const savedUser =
      localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

  }, []);


  return (
    <>

      <Header user={user} setUser={setUser} />

      <Routes>

        <Route
          path="/"
          element={<Home user={user} />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PROTECTED */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route path="/jobs" element={<Jobs />} />

        <Route path="/employers" element={<Employers />} />

        <Route path="/postjob" element={<PostJob />} />

        <Route path="/apply" element={<Apply />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/manage-companies"
          element={<ManageCompanies />}
        />

      </Routes>

    </>
  );
}

export default App;
