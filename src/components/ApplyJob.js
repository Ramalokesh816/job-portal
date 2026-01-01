import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import "./ApplyJob.css";

function Apply() {
  const { state: job } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    fullName: "",
    experience: "",
    skills: "",
  });

  if (!job) return <h2>No Job Selected</h2>;

  const submit = async (e) => {
    e.preventDefault();

    await API.post("/api/applications", {
      ...formData,
      jobTitle: job.title,
      userEmail: user.email,
      appliedAt: new Date(),
    });

    navigate("/profile");
  };

  return (
    <form className="apply" onSubmit={submit}>
      <h2>Apply for {job.title}</h2>
      <input placeholder="Full Name" onChange={e => setFormData({...formData, fullName: e.target.value})} />
      <input placeholder="Experience" onChange={e => setFormData({...formData, experience: e.target.value})} />
      <textarea placeholder="Skills" onChange={e => setFormData({...formData, skills: e.target.value})} />
      <button>Submit</button>
    </form>
  );
}

export default Apply;
