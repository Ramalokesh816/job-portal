import {
  useEffect,
  useState,
  useCallback
} from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

import "./Profile.css";

function Profile({ setUser }) {


  const navigate = useNavigate();


  /* ================= USER ================= */

  const [storedUser, setStoredUser] =
    useState(null);


  /* ================= UI ================= */

  const [activeTab, setActiveTab] =
    useState("applications");

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [isEditing, setIsEditing] =
    useState(false);


  /* ================= PROFILE PHOTO ================= */

  const [photo, setPhoto] = useState(
    localStorage.getItem("profilePhoto") ||
    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  );


  /* ================= USER DETAILS ================= */

  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: ""
  });


  /* ================= LOAD USER ================= */

  useEffect(() => {

    try {

      const userData =
        localStorage.getItem("user");

      if (!userData) {
        navigate("/login", { replace: true });
        return;
      }

      const user = JSON.parse(userData);

      if (!user?.email) {
        navigate("/login", { replace: true });
        return;
      }

      setStoredUser(user);

      setDetails({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      });

    } catch {

      navigate("/login", { replace: true });
    }

  }, [navigate]);


  /* ================= FETCH APPLICATIONS ================= */

  const loadApplications = useCallback(async () => {

    if (!storedUser?.email) {
      setLoading(false);
      return;
    }

    try {

      setLoading(true);

      const res = await API.get(
        `/api/applications/user/${storedUser.email}`
      );

      setApplications(res.data || []);

    } catch (err) {

      console.log(err);

      setApplications([]);

    } finally {

      setLoading(false);
    }

  }, [storedUser]);


  useEffect(() => {

    if (storedUser) {
      loadApplications();
    }

  }, [storedUser, loadApplications]);


  /* ================= UPLOAD PHOTO ================= */

  const handlePhotoChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {

      localStorage.setItem(
        "profilePhoto",
        reader.result
      );

      setPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  };


  /* ================= SAVE DETAILS ================= */

  const saveDetails = async () => {

    try {

      const res = await API.put(
        "/api/users/update",
        {
          name: details.name,
          phone: details.phone
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      setStoredUser(res.data);

      setIsEditing(false);

      alert("Updated ✅");

    } catch (err) {

      console.log(err);

      alert("Update failed ❌");
    }
  };


  /* ================= LOGOUT ================= */

  const logout = () => {

  // Clear storage
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Clear global auth
  setUser(null);

  // Redirect
  navigate("/login", { replace: true });
};


  /* ================= DELETE ================= */

  const deleteApplication = async (id) => {

    if (!id) {
      alert("Invalid ID ❌");
      return;
    }

    if (!window.confirm("Cancel application?"))
      return;

    try {

      await API.delete(
        `/api/applications/${id}`
      );

      setApplications(prev =>
        prev.filter(
          app => (app._id || app.id) !== id
        )
      );

      alert("Cancelled ✅");

    } catch (err) {

      console.log(err);

      alert("Cancel failed ❌");
    }
  };


  


  return (
    <div className="profile-layout">


      {/* ===== LEFT ===== */}
      <div className="profile-menu">


        <div className="profile-header">

          <img src={photo} alt="Profile" />

          <label className="upload-btn">

            Change Photo

            <input
              type="file"
              hidden
              onChange={handlePhotoChange}
            />

          </label>

          <p>{details.email}</p>

        </div>


        <ul>

          <li onClick={() => navigate("/")}>
            Home
          </li>

          <li
            className={
              activeTab === "applications"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("applications")
            }
          >
            My Applications
          </li>

          <li
            className={
              activeTab === "details"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("details")
            }
          >
            My Details
          </li>

          <li
            className="logout"
            onClick={logout}
          >
            Logout
          </li>

        </ul>

      </div>


      {/* ===== RIGHT ===== */}
      <div className="profile-content">


        {/* === APPLICATIONS === */}
        {activeTab === "applications" && (

          <>

            <h2>My Applications</h2>

            {loading ? (

              <p>Loading...</p>

            ) : applications.length === 0 ? (

              <p>No applications yet</p>

            ) : (

              <div className="applications-grid">

                {applications.map(app => (

                  <div
                    key={app._id || app.id}
                    className="app-card"
                  >

                    <p><b>Job:</b> {app.jobTitle}</p>

                    <p>
                      <b>Status:</b>{" "}
                      <span className={`status ${app.status}`}>
                        {app.status}
                      </span>
                    </p>

                    <p><b>Experience:</b> {app.experience}</p>

                    <p><b>Skills:</b> {app.skills}</p>

                    <p className="date">
                      {new Date(app.appliedAt)
                        .toDateString()}
                    </p>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteApplication(
                          app._id || app.id
                        )
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


        {/* === DETAILS === */}
        {activeTab === "details" && (

          <div className="details-section">

            <h2>

              My Details

              {!isEditing && (

                <button
                  onClick={() =>
                    setIsEditing(true)
                  }
                >
                  ✏️ Edit
                </button>

              )}

            </h2>


            <p>

              <b>Name:</b>{" "}

              {isEditing ? (

                <input
                  value={details.name}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      name: e.target.value
                    })
                  }
                />

              ) : details.name}

            </p>


            <p>
              <b>Email:</b> {details.email}
            </p>


            {isEditing && (

              <button
                onClick={saveDetails}
              >
                Save
              </button>

            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default Profile;
