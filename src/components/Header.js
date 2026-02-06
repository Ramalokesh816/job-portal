import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Header.css";

function Header() {

  const [user, setUser] = useState(null);


  useEffect(() => {

    // Function to check user
    const checkUser = () => {

      const stored =
        JSON.parse(localStorage.getItem("user"));

      setUser(stored);
    };

    // Initial check
    checkUser();

    // Check every 500ms (lightweight)
    const interval = setInterval(checkUser, 500);

    return () => clearInterval(interval);

  }, []);


  return (
    <header className="header">

      <h2 className="logo">JobConnect</h2>

      <nav>

        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/employers">Employers</Link>
        <Link to="/postjob">Post a Job</Link>


        {/* NOT LOGGED IN */}
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}


        {/* LOGGED IN */}
        {user && (
          <>
            <Link to="/profile">Profile</Link>
          </>
        )}

      </nav>

    </header>
  );
}

export default Header;
