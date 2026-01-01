import { Link } from "react-router-dom";
import "./Header.css";

function Header({ user }) {
  return (
    <header className="header">
      <h2 className="logo">JobConnect</h2>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/employers">Employers</Link>
        <Link to="/postjob">Post a Job</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <Link to="/profile">Profile</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
