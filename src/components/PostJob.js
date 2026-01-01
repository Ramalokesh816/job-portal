import { useState } from "react";
import API from "../services/api";
import "./PostJob.css";

function PostJob() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const submitJob = async (e) => {
    e.preventDefault();

    await API.post("/api/jobs", {
      title,
      company,
      description
    });

    alert("Job Posted Successfully!");
    setTitle("");
    setCompany("");
    setDescription("");
  };

  return (
    <div className="post-job">
      <h2>Post a Job</h2>

      <form onSubmit={submitJob}>
        <input
          placeholder="Job Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <input
          placeholder="Company Name"
          value={company}
          onChange={e => setCompany(e.target.value)}
          required
        />

        <textarea
          placeholder="Job Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />

        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}

export default PostJob;
