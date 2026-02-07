import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./Header.css";

function Header() {

  const [user, setUser] = useState(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const navigate = useNavigate();


  // Load user once
  useEffect(() => {

    const stored =
      localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }

  }, []);


  // Logout
  const logout = () => {

    localStorage.clear();

    setUser(null);

    navigate("/login");
  };


  return (
    <header className="header">


      {/* LOGO */}
      <h2 className="logo">
        JobConnect
      </h2>


      {/* HAMBURGER */}
      <div
        className="menu-icon"
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
      >
        ☰
      </div>


      {/* NAV LINKS */}
      <nav
        className={
          menuOpen
            ? "nav-links active"
            : "nav-links"
        }
      >

        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>

        <Link
          to="/jobs"
          onClick={() => setMenuOpen(false)}
        >
          Jobs
        </Link>

        <Link
          to="/employers"
          onClick={() => setMenuOpen(false)}
        >
          Employers
        </Link>

        <Link
          to="/postjob"
          onClick={() => setMenuOpen(false)}
        >
          Post a Job
        </Link>


        {/* NOT LOGGED IN */}
        {!user && (
          <>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
          </>
        )}


        {/* LOGGED IN */}
        {user && (
          <>
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>

            <button
              onClick={logout}
              className="logout-btn"
            >
              Logout
            </button>
          </>
        )}

      </nav>

    </header>
  );
}

export default Header;
