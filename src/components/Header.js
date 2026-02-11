import { Link } from "react-router-dom";
import { useState } from "react";

import "./Header.css";

function Header({ user }) {

  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <header className="header">

      {/* LOGO */}
      <h2 className="logo">JobConnect</h2>


      {/* MOBILE MENU ICON */}
      <div
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>


      {/* NAVIGATION */}
      <nav className={menuOpen ? "nav-links active" : "nav-links"}>

        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        <Link to="/jobs" onClick={() => setMenuOpen(false)}>
          Jobs
        </Link>

        <Link to="/employers" onClick={() => setMenuOpen(false)}>
          Employers
        </Link>


        {user && (
          <Link to="/postjob" onClick={() => setMenuOpen(false)}>
            Post Job
          </Link>
        )}


        {/* NOT LOGGED IN */}
        {!user && (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>

            <Link to="/register" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </>
        )}


        {/* LOGGED IN */}
        {user && (
          <Link to="/profile" onClick={() => setMenuOpen(false)}>
            Profile
          </Link>
        )}

      </nav>

    </header>
  );
}

export default Header;
