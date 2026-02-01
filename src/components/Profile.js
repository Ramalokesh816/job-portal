import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Profile.css";

function Profile() {

  const navigate = useNavigate();


  /* ================= USER STATE ================= */

  const [storedUser, setStoredUser] = useState(null);


  /* ================= UI STATES ================= */

  const [activeTab, setActiveTab] = useState("applications");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);


  /* ================= PROFILE PHOTO ================= */

  const [photo, setPhoto] = useState(
    localStorage.getItem("profilePhoto") ||
    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  );


  /* ================= USER DETAILS ================= */

  const [details, setDetails] = useState({
    fullName: "",
    email: "",
    phone: ""
  });


  /* ================= LOAD USER ONCE ================= */

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    setStoredUser(user);

    if (user) {
      setDetails({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || ""
      });
    }

  }, []);


  /* ================= CHECK LOGIN ================= */

  useEffect(() => {

    if (storedUser === null) return; // wait till load

    if (!storedUser?.email) {
      navigate("/login");
    }

  }, [storedUser, navigate]);


  /* ================= FETCH APPLICATIONS ================= */

  useEffect(() => {

    if (!storedUser?.email) {
      setLoading(false);
      return;
    }

    setLoading(true);

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

    setStoredUser(details);

    setIsEditing(false);

    alert("Profile updated successfully ✅");
  };


  /* ================= LOGOUT ================= */

  const logout = () => {

    localStorage.clear();

    navigate("/login");
  };


  /* ================= DELETE APPLICATION ================= */

  const deleteApplication = async (id) => {

    if (!window.confirm("Cancel this application?")) return;

    try {

      await API.delete(`/api/applications/${id}`);

      setApplications(prev =>
        prev.filter(app => app._id !== id)
      );

      alert("Application cancelled ❌");

    } catch (err) {

      console.log("Delete error:", err);
      alert("Failed to cancel");

    }
  };


  /* ================= LOADING SCREEN ================= */

  if (storedUser === null) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }


  return (
    <div className="profile-layout">


      {/* ========== LEFT MENU ========== */}
      <div className="profile-menu">


        <div className="profile-header">

          <img src={photo} alt="Profile" />

          <label className="upload-btn">

            Change Photo

            <input
              type="file"
              onChange={handlePhotoChange}
              hidden
            />

          </label>

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

                  <div key={app._id} className="app-card">

                    <p><b>Job:</b> {app.jobTitle}</p>

                    <p><b>Experience:</b> {app.experience}</p>

                    <p><b>Skills:</b> {app.skills}</p>

                    <p className="date">
                      Applied on:{" "}
                      {new Date(app.appliedAt).toDateString()}
                    </p>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteApplication(app._id)
                      }
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

              ) : details.fullName}

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

              ) : details.email}

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

              ) : details.phone}

            </p>


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
