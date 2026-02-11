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
import AdminLogin from "./components/AdminLogin";
import AdminManageJobs from "./components/AdminManageJobs";
import AdminManageEmployers from "./components/AdminManageEmployers";



function App() {

  // Load user immediately
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });


  // Sync with localStorage (login / logout / refresh)
  useEffect(() => {

    const syncUser = () => {

      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };

    syncUser();

    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
    };

  }, []);


  return (
    <>

      <Header user={user} />

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/employers" element={<Employers />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admin/jobs" element={<AdminManageJobs />} />
        <Route path="/admin/employers" element={<AdminManageEmployers />} />



        {/* AUTH */}
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/profile" replace />
              : <Login setUser={setUser} />
          }
        />

        <Route
          path="/register"
          element={
            user
              ? <Navigate to="/profile" replace />
              : <Register />
          }
        />


        {/* PROTECTED */}
        <Route
  path="/profile"
  element={
    user ? <Profile setUser={setUser} /> : <Navigate to="/login" replace />
  }
/>

        /

        <Route
          path="/apply"
          element={
            user
              ? <Apply />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/postjob"
          element={
            user
              ? <PostJob />
              : <Navigate to="/login" replace />
          }
        />

      </Routes>

    </>
  );
}

export default App;
