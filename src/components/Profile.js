import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Profile.css";

function Profile({ setUser }) {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [activeTab, setActiveTab] = useState("applications");
  const [applications, setApplications] = useState([]);

  // 🔹 PROFILE IMAGE (PERSISTENT)
  const [photo, setPhoto] = useState(
    localStorage.getItem("profilePhoto") ||
    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  );

  // 🔹 USER DETAILS
  const [details, setDetails] = useState({
    fullName: storedUser?.fullName || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
  });

  // 🔹 EDIT FLAGS
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPhone, setEditPhone] = useState(false);

  // 🔹 FETCH APPLICATIONS (FIXED)
  useEffect(() => {
    API.get("/api/applications")
      .then((res) => {
        const filtered = res.data.filter(
          (app) => app.userEmail === storedUser.email
        );
        setApplications(filtered);
      })
      .catch(() => setApplications([]));
  }, [storedUser.email]);

  // 🔹 UPLOAD PROFILE IMAGE
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("profilePhoto", reader.result);
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 🔹 UPDATE DETAILS
  const updateDetails = () => {
    localStorage.setItem("user", JSON.stringify(details));
    setUser(details);

    setEditName(false);
    setEditEmail(false);
    setEditPhone(false);

    alert("Profile updated successfully");
  };

  // 🔹 LOGOUT (DATA NOT DELETED)
  const logout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <div className="profile-layout">
      {/* LEFT MENU */}
      <div className="profile-menu">
        <div className="profile-header">
          <img src={photo} alt="Profile" />
          <input type="file" onChange={handlePhotoChange} />
          <h3>{details.fullName}</h3>
          <p>{details.email}</p>
        </div>

        <ul>
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => setActiveTab("applications")}>My Applications</li>
          <li onClick={() => setActiveTab("details")}>My Details</li>
          <li className="logout" onClick={logout}>Logout</li>
        </ul>
      </div>

      {/* RIGHT CONTENT */}
      <div className="profile-content">
        {/* APPLICATIONS */}
        {activeTab === "applications" && (
          <>
            <h2>My Applications</h2>
            {applications.length === 0 ? (
              <p>No applications submitted yet</p>
            ) : (
              applications.map((app, i) => (
                <div key={i} className="app-card">
                  <p><b>Job:</b> {app.jobTitle}</p>
                  <p><b>Experience:</b> {app.experience}</p>
                  <p><b>Skills:</b> {app.skills}</p>
                  <p className="date">
                    Applied on: {new Date(app.appliedAt).toDateString()}
                  </p>
                </div>
              ))
            )}
          </>
        )}

        {/* MY DETAILS */}
        {activeTab === "details" && (
          <div className="details-section">
            <h2>My Details</h2>

            <p>
              <b>Name:</b> {details.fullName}
              <span onClick={() => setEditName(true)}> ✏️</span>
            </p>

            <p>
              <b>Email:</b> {details.email}
              <span onClick={() => setEditEmail(true)}> ✏️</span>
            </p>

            <p>
              <b>Mobile:</b> {details.phone}
              <span onClick={() => setEditPhone(true)}> ✏️</span>
            </p>

            {(editName || editEmail || editPhone) && (
              <div className="edit-form">
                {editName && (
                  <input
                    value={details.fullName}
                    onChange={(e) =>
                      setDetails({ ...details, fullName: e.target.value })
                    }
                  />
                )}

                {editEmail && (
                  <input
                    value={details.email}
                    onChange={(e) =>
                      setDetails({ ...details, email: e.target.value })
                    }
                  />
                )}

                {editPhone && (
                  <input
                    value={details.phone}
                    onChange={(e) =>
                      setDetails({ ...details, phone: e.target.value })
                    }
                  />
                )}

                <button onClick={updateDetails}>Update Details</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
