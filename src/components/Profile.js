import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Profile.css";

function Profile() {

  const navigate = useNavigate();

  // Get logged-in user
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Tabs
  const [activeTab, setActiveTab] = useState("applications");

  // Applications
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Profile photo
  const [photo, setPhoto] = useState(
    localStorage.getItem("profilePhoto") ||
    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  );

  // User details
  const [details, setDetails] = useState({
    fullName: storedUser?.fullName || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || ""
  });


  /* ================= CHECK LOGIN ================= */

  useEffect(() => {
    if (!storedUser || !storedUser.email) {
      navigate("/login");
    }
  }, [storedUser, navigate]);


  /* ================= FETCH APPLICATIONS ================= */

  useEffect(() => {

    if (!storedUser || !storedUser.email) {
      setLoading(false);
      return;
    }

    API.get(`/api/applications/user/${storedUser.email}`)
      .then((res) => {
        setApplications(res.data);
      })
      .catch((err) => {
        console.log("Fetch error:", err);
        setApplications([]);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [storedUser]);


  /* ================= UPLOAD PHOTO ================= */

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


  /* ================= SAVE DETAILS ================= */

  const saveDetails = () => {

    localStorage.setItem("user", JSON.stringify(details));

    setIsEditing(false);

    alert("Profile updated successfully ✅");
  };


  /* ================= LOGOUT ================= */

  const logout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("profilePhoto");

    navigate("/login");
  };


  /* ================= DELETE APPLICATION ================= */

  const deleteApplication = async (id) => {

    if (!window.confirm("Cancel this application?")) return;

    try {

      await API.delete(`/api/applications/${id}`);

      setApplications(
        applications.filter(app => app.id !== id)
      );

      alert("Application cancelled ❌");

    } catch (err) {

      console.log(err);
      alert("Failed to cancel");

    }
  };


  return (
    <div className="profile-layout">


      {/* ========== LEFT MENU ========== */}
      <div className="profile-menu">

        <div className="profile-header">

          {/* Profile Photo */}
          <img src={photo} alt="Profile" />

          {/* Custom Upload Button */}
          <label className="upload-btn">
            Change Photo
            <input
              type="file"
              onChange={handlePhotoChange}
              hidden
            />
          </label>

          {/* Email Only (No Username) */}
          <p>{details.email}</p>

        </div>


        <ul>

          <li onClick={() => navigate("/")}>Home</li>

          <li
            className={activeTab === "applications" ? "active" : ""}
            onClick={() => setActiveTab("applications")}
          >
            My Applications
          </li>

          <li
            className={activeTab === "details" ? "active" : ""}
            onClick={() => setActiveTab("details")}
          >
            My Details
          </li>

          <li className="logout" onClick={logout}>
            Logout
          </li>

        </ul>

      </div>



      {/* ========== RIGHT CONTENT ========== */}
      <div className="profile-content">


        {/* ========== APPLICATIONS TAB ========== */}
        {activeTab === "applications" && (

  <>
    <h2>My Applications</h2>

    {loading ? (

      <p>Loading...</p>

    ) : applications.length === 0 ? (

      <p>No applications submitted yet</p>

    ) : (

      <div className="applications-grid">

        {applications.map((app) => (

          <div key={app.id} className="app-card">

            <p><b>Job:</b> {app.jobTitle}</p>
            <p><b>Experience:</b> {app.experience}</p>
            <p><b>Skills:</b> {app.skills}</p>

            <p className="date">
              Applied on:{" "}
              {new Date(app.appliedAt).toDateString()}
            </p>

            <button
              className="delete-btn"
              onClick={() => deleteApplication(app.id)}
            >
              Cancel Application
            </button>

          </div>

        ))}

      </div>
    )}

  </>
)}



        {/* ========== DETAILS TAB ========== */}
        {activeTab === "details" && (

          <div className="details-section">

            <h2>
              My Details

              {!isEditing && (
                <button
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit
                </button>
              )}
            </h2>


            {/* Name */}
            <p>
              <b>Name:</b>{" "}
              {isEditing ? (
                <input
                  value={details.fullName}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      fullName: e.target.value
                    })
                  }
                />
              ) : (
                details.fullName
              )}
            </p>


            {/* Email */}
            <p>
              <b>Email:</b>{" "}
              {isEditing ? (
                <input
                  value={details.email}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      email: e.target.value
                    })
                  }
                />
              ) : (
                details.email
              )}
            </p>


            {/* Phone */}
            <p>
              <b>Mobile:</b>{" "}
              {isEditing ? (
                <input
                  value={details.phone}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      phone: e.target.value
                    })
                  }
                />
              ) : (
                details.phone
              )}
            </p>


            {/* Save Button */}
            {isEditing && (
              <button
                className="save-btn"
                onClick={saveDetails}
              >
                Save Changes
              </button>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default Profile;
