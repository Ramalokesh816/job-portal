import "./Home.css";
import home from "../assets/home.png";
import seeker from "../assets/seeker.png";
import employer from "../assets/employer.png";
import admin from "../assets/admin.png";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer"; // ✅ Add this

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <div>
          <h1>Find Your Dream Job Today!</h1>
          <p>Connect with top employers & find the right career opportunity.</p>

          <div>
            <button
              className="btn primary"
              onClick={() => navigate("/jobs")}
            >
              Browse Jobs
            </button>

            <button
              className="btn primary"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </div>
        </div>

        <img src={home} alt="home" />
      </section>

      <section className="cards">
        <div className="card">
          <img src={seeker} alt="Job Seeker" />
          <p>Search & apply for jobs easily</p>

          <button
            className="btn primary"
            onClick={() => navigate("/jobs")}
          >
            For Job Seekers
          </button>
        </div>

        <div className="card">
          <img src={employer} alt="Employer" />
          <p>Post jobs & hire talent</p>

          <button
            className="btn primary"
            onClick={() => navigate("/employers")}
          >
            For Employers
          </button>
        </div>

        <div className="card">
          <img src={admin} alt="Admin" />
          <p>Manage users & postings</p>

          <button
            className="btn primary"
            onClick={() => navigate("/profile")}
          >
            Admin Dashboard
          </button>
        </div>
      </section>

      {/* ✅ Footer Added Here */}
      <Footer />
    </>
  );
}

export default Home;
