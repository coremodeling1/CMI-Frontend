import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Profile.css";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook

const API_BASE =
  process.env.REACT_APP_API_BASE || "https://cmi-backend-6xf1.onrender.com";

// Format date as dd-mm-yyyy
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString; // if it's not valid date, fallback
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Profile = () => {
  const navigate = useNavigate(); // ✅ initialize navigation
  // load user from localStorage (login stores the user with token)
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = storedUser?.token || null;

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  // original server-backed data
  const [user, setUser] = useState(storedUser || {});
  // editable form state
  const [updatedUser, setUpdatedUser] = useState({ ...storedUser });

  // profile picture state
  const [profilePicPreview, setProfilePicPreview] = useState(
    storedUser.profilePic || null
  );
  const [profilePicFile, setProfilePicFile] = useState(null);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync updatedUser/profile preview when user changes externally
  useEffect(() => {
    setUpdatedUser({ ...user });
    setProfilePicPreview(user.profilePic || null);
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data) {
          const updated = {
            ...res.data,
            token, // keep token
          };

          setUser(updated);
          setUpdatedUser(updated);
          setProfilePicPreview(updated.profilePic || null);

          // ✅ sync latest status into localStorage
          localStorage.setItem("user", JSON.stringify(updated));
        }
      } catch (err) {
        console.error("Failed to fetch latest profile:", err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChangePassword = async () => {
    if (!token) {
      alert("You must be logged in to update password.");
      return;
    }
    if (!oldPassword || !newPassword) {
      alert("Please fill in both fields.");
      return;
    }

    setPwdLoading(true);
    try {
      const res = await axios.put(
        `${API_BASE}/api/auth/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Password updated successfully.");
      setShowPasswordForm(false);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Change password failed:", err.response || err.message);
      alert(err.response?.data?.message || "Failed to update password.");
    } finally {
      setPwdLoading(false);
    }
  };

  // Text inputs change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  // Profile picture selection
  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePicFile(file);
    setProfilePicPreview(URL.createObjectURL(file));
    setUpdatedUser((p) => ({ ...p, profilePic: URL.createObjectURL(file) }));
  };

  // Cancel edits
  const handleCancel = () => {
    setUpdatedUser({ ...user });
    setProfilePicPreview(user.profilePic || null);
    setProfilePicFile(null);
    setEditing(false);
  };

  // Save updates
  const handleSave = async () => {
    if (!token) {
      alert("You must be logged in to update profile.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Append text fields (make sure role & identity included)
      const textFields = [
        "name",
        "email",
        "role",
        "identity",
        "description",
        "contact",
        "gender",
        "dob",
        "city",
        "state",
        "country",
        "language",
        "instagram", // ✅ add
        "instagramFollowers", // ✅ add

        // 🔽 NEW COMMON ARTIST FIELDS
        "willingToTravel",
        "experience",
        "internationalProjects",
        "availabilityForCasting",
        "aboutYourself",
      ];
      textFields.forEach((f) => {
        if (updatedUser[f] !== undefined && updatedUser[f] !== null) {
          formData.append(f, updatedUser[f]);
        }
      });

      if (updatedUser.artistDetails && updatedUser.identity) {
        formData.append(
          "identityDetails",
          JSON.stringify(updatedUser.artistDetails[updatedUser.identity] || {})
        );
      }

      // Profile picture
      if (profilePicFile) {
        formData.append("profilePic", profilePicFile);
      }

      // Request
      const res = await axios.put(`${API_BASE}/api/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res && res.data) {
        const updated = {
          ...res.data,
          token, // keep token
        };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setUpdatedUser({ ...updated });
        setProfilePicFile(null);
        setProfilePicPreview(updated.profilePic || null);
        setEditing(false);
        alert("Profile updated successfully.");
      } else {
        alert("Unexpected response from server while updating profile.");
      }
    } catch (err) {
      console.error("Profile update failed:", err.response || err.message);
      alert(
        err.response?.data?.message || "Failed to update profile. See console."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fields to render
  const allFields = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Identity", key: "identity" },
    { label: "Contact", key: "contact" },
    { label: "Gender", key: "gender" },
    { label: "DOB", key: "dob" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
    { label: "Country", key: "country" },
    { label: "Language", key: "language" },

    // 🔽 NEW COMMON ARTIST FIELDS
    { label: "Willing to Travel", key: "willingToTravel" },
    { label: "Experience", key: "experience" },
    { label: "International Projects", key: "internationalProjects" },
    { label: "Availability for Casting", key: "availabilityForCasting" },
    { label: "About Yourself", key: "aboutYourself", textarea: true },

    { label: "About", key: "description", textarea: true },
    { label: "Instagram", key: "instagram" },
    { label: "Instagram Followers", key: "instagramFollowers" },
  ];

  // Recruiters: only show name, email, contact (role + identity are hidden)
  const fields =
    user.role === "recruiter"
      ? allFields.filter((f) => ["name", "email", "contact"].includes(f.key))
      : user.role === "artist"
      ? allFields // ✅ artists see everything, including Instagram
      : allFields.filter(
          (f) => !["instagram", "instagramFollowers"].includes(f.key) // ✅ hide IG fields
        );

  // const getStatusLabel = (status) => {
  //   if (status === "approved") return "Approved";
  //   if (status === "rejected") return "Rejected";
  //   return "Pending Approval";
  // };

  // 🔽 Identity-based extra fields
  const identityFields = {
    model: [
      { label: "Height", key: "artistDetails.model.height" },
      { label: "Weight", key: "artistDetails.model.weight" },
      { label: "Bust", key: "artistDetails.model.bust" },
      { label: "Waist", key: "artistDetails.model.waist" },
      { label: "Hips", key: "artistDetails.model.hips" },
      { label: "Bikini / Swimwear", key: "artistDetails.model.bikiniSwimwear" },
      {
        label: "Bold / Semi Bold",
        key: "artistDetails.model.boldSemiBoldWebSeries",
      },
      {
        label: "Nude / Semi Nude",
        key: "artistDetails.model.nudeSemiNudeShoots",
      },
      { label: "Calendar / Ads", key: "artistDetails.model.calendarShootsAds" },
      { label: "Tattoos on Body", key: "artistDetails.model.tattoosOnBody" },
    ],

    advertisingProfessional: [
      { label: "Height", key: "artistDetails.advertisingProfessional.height" },
      { label: "Weight", key: "artistDetails.advertisingProfessional.weight" },
      { label: "Bust", key: "artistDetails.advertisingProfessional.bust" },
      { label: "Waist", key: "artistDetails.advertisingProfessional.waist" },
      { label: "Hips", key: "artistDetails.advertisingProfessional.hips" },
      {
        label: "Night Wear",
        key: "artistDetails.advertisingProfessional.nightWear",
      },
      {
        label: "Bikini / Swimwear",
        key: "artistDetails.advertisingProfessional.bikiniSwimwear",
      },
      {
        label: "Bold / Semi Bold",
        key: "artistDetails.advertisingProfessional.boldSemiBoldWebSeries",
      },
      {
        label: "Nude / Semi Nude",
        key: "artistDetails.advertisingProfessional.nudeSemiNudeShoots",
      },
      {
        label: "Movie / Ads / Album Songs",
        key: "artistDetails.advertisingProfessional.movieAdAlbumSongs",
      },
      {
        label: "Calendar / Ads",
        key: "artistDetails.advertisingProfessional.calendarShootsAds",
      },
      {
        label: "Tattoos on Body",
        key: "artistDetails.advertisingProfessional.tattoosOnBody",
      },
    ],

    actor: [
      { label: "Current Project", key: "artistDetails.actor.currentProject" },
      { label: "Bold Scenes", key: "artistDetails.actor.boldScenes" },
      {
        label: "Love Making Scenes",
        key: "artistDetails.actor.loveMakingScenes",
      },
      { label: "Web Series", key: "artistDetails.actor.webSeries" },
      {
        label: "Background Artist",
        key: "artistDetails.actor.backgroundArtist",
      },
    ],

    photographer: [
      { label: "Bold Shoots", key: "artistDetails.photographer.boldShoots" },
      {
        label: "Semi Nude Shoots",
        key: "artistDetails.photographer.semiNudeShoots",
      },
      {
        label: "Calendar / Ads",
        key: "artistDetails.photographer.calendarShootsAds",
      },
    ],

    filmmaker: [
      { label: "Item Songs", key: "artistDetails.filmmaker.itemSongs" },
      { label: "Bold Scenes", key: "artistDetails.filmmaker.boldScenes" },
      {
        label: "Love Making Scenes",
        key: "artistDetails.filmmaker.loveMakingScenes",
      },
    ],

    dancer: [
      { label: "Background Role", key: "artistDetails.dancer.backgroundRole" },
      { label: "Item Songs", key: "artistDetails.dancer.itemSongs" },
      { label: "Bold Shoots", key: "artistDetails.dancer.boldShoots" },
    ],

    singer: [
      { label: "Genres", key: "artistDetails.singer.genres" },
      {
        label: "Multiple Languages",
        key: "artistDetails.singer.multipleLanguages",
      },
    ],

    musician: [
      { label: "Instruments", key: "artistDetails.musician.instruments" },
      {
        label: "Adaptable Styles",
        key: "artistDetails.musician.adaptableStyles",
      },
    ],

    stylist: [
      {
        label: "Styling Experience",
        key: "artistDetails.stylist.experienceInStyling",
      },
      {
        label: "Comfortable On Set",
        key: "artistDetails.stylist.comfortableOnSet",
      },
    ],
  };

  const extraFields =
    user.role === "artist" && identityFields[user.identity]
      ? identityFields[user.identity]
      : [];

  return (
    <>
      <Navbar />
      <div className="profile-body">
        {/* ✅ Gallery button ONLY for approved artists */}
        {user.role === "artist" && user.status === "approved" && (
          <div className="top-right-btn">
            <button
              onClick={() => navigate("/gallery")}
              className="gallery-btn"
            >
              Your Gallery
            </button>
          </div>
        )}

        <div className="profile-container">
          <h2 className="profile-title">Your Profile</h2>

          {user.role === "artist" && (
            <div className="profile-status">
              <span
                className={`status-badge ${
                  user.status === "approved"
                    ? "approved"
                    : user.status === "rejected"
                    ? "rejected"
                    : "pending"
                }`}
              >
                {user.status === "approved"
                  ? "Approved"
                  : user.status === "rejected"
                  ? "Rejected"
                  : "Pending Approval"}
              </span>

              {user.status === "pending" && (
                <p className="status-note">⏳ Your profile is under review.</p>
              )}

              {user.status === "rejected" && (
                <p className="status-note error">
                  ❌ Your profile was rejected. Please update your details.
                </p>
              )}

              {/* 🚫 Gallery locked message */}
              {user.status !== "approved" && (
                <p className="status-note error">
                  🚫 Gallery access is locked until your profile is approved.
                </p>
              )}
            </div>
          )}

          {/* Profile picture */}
          <div className="profile-pic-section">
            <img
              src={profilePicPreview || "/default-avatar.png"}
              alt="Profile"
              className="profile-avatar-circle"
            />
            {editing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="file-input"
              />
            )}
          </div>

          {/* Update buttons */}
          <div className="profile-actions">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="cancel-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="edit-btn">
                Update Profile
              </button>
            )}
          </div>

          {/* Info card */}
          <div className="profile-info-card">
            <div className="profile-info-grid">
              {fields.map(({ label, key, textarea }) => (
                <div key={key} className="form-row">
                  <label>{label}:</label>
                  {editing ? (
                    textarea ? (
                      <textarea
                        name={key}
                        value={updatedUser[key] || ""}
                        onChange={handleChange}
                        rows="4"
                        style={{
                          resize: "vertical",
                          overflowWrap: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                        disabled={
                          user.role === "recruiter" &&
                          ["role", "identity"].includes(key)
                        }
                      />
                    ) : key === "dob" ? (
                      <input
                        type="date"
                        name={key}
                        value={
                          updatedUser.dob ? updatedUser.dob.split("T")[0] : ""
                        }
                        onChange={handleChange}
                      />
                    ) : (
                      <input
                        type="text"
                        name={key}
                        value={updatedUser[key] || ""}
                        onChange={handleChange}
                        disabled={
                          user.role === "recruiter" &&
                          ["role", "identity"].includes(key)
                        }
                      />
                    )
                  ) : key === "dob" ? (
                    <p>{formatDate(updatedUser.dob)}</p>
                  ) : (
                    <p>{updatedUser[key] || "Not provided"}</p>
                  )}
                </div>
              ))}

              {extraFields.map(({ label, key }) => {
                const parts = key.split(".");
                const root = parts[0]; // artistDetails
                const role = parts[1]; // model / actor / dancer etc
                const field = parts[2]; // actual field

                return (
                  <div key={key} className="form-row">
                    <label>{label}:</label>

                    {editing ? (
                      typeof updatedUser[root]?.[role]?.[field] ===
                      "boolean" ? (
                        <select
                          value={
                            updatedUser[root]?.[role]?.[field] ? "yes" : "no"
                          }
                          onChange={(e) =>
                            setUpdatedUser((prev) => ({
                              ...prev,
                              [root]: {
                                ...(prev[root] || {}),
                                [role]: {
                                  ...(prev[root]?.[role] || {}),
                                  [field]: e.target.value === "yes",
                                },
                              },
                            }))
                          }
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={updatedUser[root]?.[role]?.[field] || ""}
                          onChange={(e) =>
                            setUpdatedUser((prev) => ({
                              ...prev,
                              [root]: {
                                ...(prev[root] || {}),
                                [role]: {
                                  ...(prev[root]?.[role] || {}),
                                  [field]: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      )
                    ) : (
                      <p>
                        {String(
                          updatedUser[root]?.[role]?.[field] ?? "Not provided"
                        )}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Password card */}
          <div className="password-card">
            <div className="password-card-header">
              <button
                className="password-toggle-btn"
                onClick={() => setShowPasswordForm((s) => !s)}
              >
                {showPasswordForm ? "Close" : "Change Password"}
              </button>
            </div>

            {showPasswordForm && (
              <div className="password-form">
                <div className="form-row">
                  <label>Old Password:</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <label>New Password:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="password-actions">
                  <button
                    onClick={handleChangePassword}
                    className="save-btn"
                    disabled={pwdLoading}
                  >
                    {pwdLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
