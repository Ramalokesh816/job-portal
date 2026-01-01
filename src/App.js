import {Routes, Route } from "react-router-dom";
import { useState } from "react";

import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Jobs from "./components/Jobs";
import Employers from "./components/Employers";
import PostJob from "./components/PostJob"; 
import Apply from "./components/ApplyJob";

<Route path="/apply" element={<Apply />} />


function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  return (
    <>
      <Header user={user} />

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile setUser={setUser} />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/employers" element={<Employers />} />
        <Route path="/postjob" element={<PostJob />} />
        <Route path="/apply" element={<Apply />} />
      </Routes>
    </>
  );
}

export default App;
