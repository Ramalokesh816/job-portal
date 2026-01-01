import { useEffect, useState } from "react";
import API from "../services/api";
import "./Employers.css";

function Employers() {
  const [employers, setEmployers] = useState([]);

  useEffect(() => {
    API.get("/api/employers")
      .then(res => setEmployers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page">
      <h2>Top Employers</h2>

      <div className="employer-list">
        {employers.map(emp => (
          <div key={emp.id} className="employer-card">
            <h3>{emp.name}</h3>
            <p>Hiring {emp.hiringFor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Employers;
