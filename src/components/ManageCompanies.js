import { useEffect, useState } from "react";
import API from "../services/api";
import "./Admin.css";

function ManageCompanies() {

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get("/api/employers");
    setCompanies(res.data);
  };

  const deleteCompany = async (id) => {

    if (!window.confirm("Delete company?")) return;

    await API.delete(`/api/employers/${id}`);

    alert("Deleted ✅");
    load();
  };

  return (
    <div className="admin-page">

      <h2>Manage Companies</h2>

      {companies.map(c => (

        <div key={c.id} className="company-row">

          <b>{c.name}</b>

          <button
            className="del"
            onClick={() => deleteCompany(c.id)}
          >
            Delete
          </button>

        </div>

      ))}

    </div>
  );
}

export default ManageCompanies;
