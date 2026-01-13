import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/ArtistsPage.css";

const backendURL = "https://cmi-backend-6xf1.onrender.com";

const AdminArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Role categories
  const roles = [
    "model",
    "actor",
    "influencer",
    "writer",
    "stylist",
    "photographer",
    "advertising professional",
    "singer",
    "musician",
    "dancer",
    "anchor",
    "voice-over artist",
    "filmmaker",
    "standup-comedian",
  ];

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await fetch(`${backendURL}/api/artists`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        let data = await res.json();
        data = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setArtists(data);
      } catch (err) {
        console.error("Error fetching artists:", err);
      }
    };
    fetchArtists();
  }, [user]);

  // ✅ Apply filters
  const filteredArtists = artists.filter((artist) => {
    // Status filter
    const statusMatch =
      statusFilter === "all"
        ? true
        : statusFilter === "pending"
        ? !artist.status || artist.status === "pending"
        : artist.status === statusFilter;

    // Role filter
    const roleMatch = roleFilter
      ? (artist.identity || artist.role || "")
          .toLowerCase()
          .includes(roleFilter.toLowerCase())
      : true;

    return statusMatch && roleMatch;
  });

  const handleStatusUpdate = async (artistId, status) => {
    try {
      const res = await fetch(`${backendURL}/api/artists/${artistId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      const updatedArtist = await res.json();
      setArtists((prev) =>
        prev.map((a) => (a._id === artistId ? updatedArtist : a))
      );
    } catch (err) {
      console.error(`Error updating status for artist ${artistId}:`, err);
    }
  };

  const getFirstMedia = (artist) => {
    if (artist.photos?.length > 0)
      return { type: "image", src: artist.photos[0] };
    if (artist.videos?.length > 0)
      return { type: "video", src: artist.videos[0] };
    return null;
  };

  const handleDeleteMedia = async (artistId, url, type) => {
    try {
      const res = await fetch(`${backendURL}/api/artists/${artistId}/media`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ url, type }), // include media type
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete media");
      }

      const updatedArtist = await res.json();

      // ✅ Update local state
      setArtists((prev) =>
        prev.map((a) =>
          a._id === artistId
            ? {
                ...a,
                photos: updatedArtist.photos,
                videos: updatedArtist.videos,
              }
            : a
        )
      );

      if (selectedArtist && selectedArtist._id === artistId) {
        setSelectedArtist((prev) => ({
          ...prev,
          photos: updatedArtist.photos,
          videos: updatedArtist.videos,
        }));
      }

      console.log("Deleted successfully:", updatedArtist);
    } catch (err) {
      console.error("Error deleting media:", err);
    }
  };

  const identityFields = {
    model: [
      { label: "Height", key: "height" },
      { label: "Weight", key: "weight" },
      { label: "Bust", key: "bust" },
      { label: "Waist", key: "waist" },
      { label: "Hips", key: "hips" },
      { label: "Night Wear", key: "nightWear" },
      { label: "Bikini / Swimwear", key: "bikiniSwimwear" },
      { label: "Bold / Semi Bold", key: "boldSemiBoldWebSeries" },
      { label: "Nude / Semi Nude", key: "nudeSemiNudeShoots" },
      { label: "Movie / Ads / Album", key: "movieAdAlbumSongs" },
      { label: "Calendar / Ads", key: "calendarShootsAds" },
      { label: "Tattoos on Body", key: "tattoosOnBody" },
    ],

    advertisingProfessional: [
      { label: "Height", key: "height" },
      { label: "Weight", key: "weight" },
      { label: "Bust", key: "bust" },
      { label: "Waist", key: "waist" },
      { label: "Hips", key: "hips" },
      { label: "Night Wear", key: "nightWear" },
      { label: "Bikini / Swimwear", key: "bikiniSwimwear" },
      { label: "Bold / Semi Bold", key: "boldSemiBoldWebSeries" },
      { label: "Nude / Semi Nude", key: "nudeSemiNudeShoots" },
      { label: "Movie / Ads / Album", key: "movieAdAlbumSongs" },
      { label: "Calendar / Ads", key: "calendarShootsAds" },
      { label: "Tattoos on Body", key: "tattoosOnBody" },
    ],

    actor: [
      { label: "Current Project", key: "currentProject" },
      { label: "Bold Scenes", key: "boldScenes" },
      { label: "Semi Nude Scenes", key: "semiNudeScenes" },
      { label: "Web Series", key: "webSeries" },
      { label: "Item Songs", key: "itemSongs" },
      { label: "Background Artist", key: "backgroundArtist" },
      { label: "Love Making Scenes", key: "loveMakingScenes" },
    ],

    dancer: [
      { label: "Background Role", key: "backgroundRole" },
      { label: "Item Songs", key: "itemSongs" },
      { label: "Bold Shoots", key: "boldShoots" },
      { label: "Movie / Ads / Album", key: "movieAdsAlbumSongs" },
    ],

    singer: [
      { label: "Genres", key: "genres" },
      { label: "Multiple Languages", key: "multipleLanguages" },
      { label: "Industry Experience", key: "industryExperience" },
    ],

    musician: [
      { label: "Instruments", key: "instruments" },
      { label: "Adaptable Styles", key: "adaptableStyles" },
    ],

    stylist: [
      { label: "Styling Experience", key: "experienceInStyling" },
      { label: "Comfortable On Set", key: "comfortableOnSet" },
    ],

    photographer: [
      { label: "Bold Shoots", key: "boldShoots" },
      { label: "Semi Nude Shoots", key: "semiNudeShoots" },
      { label: "Calendar / Ads", key: "calendarShootsAds" },
    ],

    filmmaker: [
      { label: "Item Songs", key: "itemSongs" },
      { label: "Bold Scenes", key: "boldScenes" },
      { label: "Love Making Scenes", key: "loveMakingScenes" },
      { label: "Movie / Ads / Album", key: "movieAdsAlbumShoots" },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="artists-page">
        <h1 className="page-title">Admin - Manage Artists</h1>
        {/* ✅ FILTERS */}
        <div className="filters">
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>

          {/* Role */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="artists-grid">
          {filteredArtists.length > 0 ? (
            filteredArtists.map((artist) => {
              const firstMedia = getFirstMedia(artist);
              return (
                <div
                  className="artist-card"
                  key={artist._id || `artist-${Math.random()}`}
                  onClick={() => setSelectedArtist(artist)}
                >
                  {firstMedia?.type === "image" && (
                    <img
                      src={firstMedia.src}
                      alt={artist.name}
                      className="artist-photo"
                    />
                  )}
                  {firstMedia?.type === "video" && (
                    <video
                      className="artist-video"
                      controls
                      src={firstMedia.src}
                    />
                  )}

                  <h2>{artist.name}</h2>

                  <div className="artist-info">
                    <p>
                      <strong>Role:</strong> {artist.identity || artist.role}
                    </p>
                    <p>
                      <strong>Email:</strong> {artist.email}
                    </p>
                    <p>
                      <strong>Contact:</strong> {artist.contact || "N/A"}
                    </p>
                    <p>
                      <strong>Gender:</strong> {artist.gender || "N/A"}
                    </p>
                    <p>
                      <strong>DOB:</strong>{" "}
                      {artist.dob
                        ? new Date(artist.dob).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>City:</strong> {artist.city || "N/A"}
                    </p>
                    <p>
                      <strong>State:</strong> {artist.state || "N/A"}
                    </p>
                    <p>
                      <strong>Country:</strong> {artist.country || "N/A"}
                    </p>
                    <p>
                      <strong>Language:</strong> {artist.language || "N/A"}
                    </p>
                    <p> <strong>Description:</strong> {artist.description}</p>

                    {artist.artistDetails &&
                      identityFields[artist.identity] && (
                        <div className="artist-extra-fields">
                          <h3>Professional Details</h3>

                          {identityFields[artist.identity].map(
                            ({ label, key }) => {
                              const value =
                                artist.artistDetails?.[artist.identity]?.[key];

                              return (
                                <p key={key}>
                                  <strong>{label}:</strong>{" "}
                                  {typeof value === "boolean"
                                    ? value
                                      ? "Yes"
                                      : "No"
                                    : value || "N/A"}
                                </p>
                              );
                            }
                          )}
                        </div>
                      )}

                    <p>
                      <strong>Instagram:</strong>{" "}
                      {artist.instagram ? (
                        <a
                          href={artist.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {artist.instagram}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>

                    <p>
                      <strong>Followers:</strong>{" "}
                      {artist.instagramFollowers || "N/A"}
                    </p>

                    <p>
                      <strong>Status:</strong> {artist.status || "pending"}
                    </p>
                  </div>

                  <div className="status-buttons">
                    <button
                      className="approve-btn"
                      disabled={artist.status === "approved"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(artist._id, "approved");
                      }}
                    >
                      {artist.status === "approved" ? "Approved" : "Approve"}
                    </button>
                    <button
                      className="reject-btn"
                      disabled={artist.status === "rejected"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(artist._id, "rejected");
                      }}
                    >
                      {artist.status === "rejected" ? "Rejected" : "Reject"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p key="no-artists">No artists found.</p>
          )}
        </div>

        {/* Modal */}
        {selectedArtist && (
          <div className="artist-modal">
            <div className="artist-modal-content">
              <button
                className="close-btn"
                onClick={() => setSelectedArtist(null)}
              >
                ✖
              </button>

              <h2>{selectedArtist.name}</h2>

              <div className="artist-photos-gallery">
                {[
                  ...(selectedArtist.photos || []),
                  ...(selectedArtist.videos || []),
                ]
                  .slice(0, 4)
                  .map((media, idx) =>
                    media.includes("mp4") ? (
                      <div key={`video-${media}-${idx}`} className="media-item">
                        <video
                          controls
                          className="artist-gallery-photo"
                          onClick={() =>
                            setPreviewMedia({ type: "video", src: media })
                          }
                        >
                          <source src={media} type="video/mp4" />
                        </video>
                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDeleteMedia(
                              selectedArtist._id,
                              media,
                              "video"
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <div key={`img-${media}-${idx}`} className="media-item">
                        <img
                          src={media}
                          alt={`${selectedArtist.name} ${idx}`}
                          className="artist-gallery-photo"
                          onClick={() =>
                            setPreviewMedia({ type: "image", src: media })
                          }
                        />
                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDeleteMedia(
                              selectedArtist._id,
                              media,
                              "photo"
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    )
                  )}

                {(selectedArtist.photos?.length || 0) +
                  (selectedArtist.videos?.length || 0) >
                  4 && (
                  <p className="premium-msg">✨ Buy premium to see more ✨</p>
                )}
              </div>

              <div className="artist-info">
                <p>
                  <strong>Role:</strong>{" "}
                  {selectedArtist.identity || selectedArtist.role}
                </p>
                <p>
                  <strong>Email:</strong> {selectedArtist.email}
                </p>
                <p>
                  <strong>Contact:</strong> {selectedArtist.contact || "N/A"}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedArtist.gender || "N/A"}
                </p>
                <p>
                  <strong>DOB:</strong>{" "}
                  {selectedArtist.dob
                    ? new Date(selectedArtist.dob).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>City:</strong> {selectedArtist.city || "N/A"}
                </p>
                <p>
                  <strong>State:</strong> {selectedArtist.state || "N/A"}
                </p>
                <p>
                  <strong>Country:</strong> {selectedArtist.country || "N/A"}
                </p>
                <p>
                  <strong>Language:</strong> {selectedArtist.language || "N/A"}
                </p>
                <p>{selectedArtist.description}</p>
                <p>
                  <strong>Instagram:</strong>{" "}
                  {selectedArtist.instagram ? (
                    <a
                      href={selectedArtist.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedArtist.instagram}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>

                <p>
                  <strong>Followers:</strong>{" "}
                  {selectedArtist.instagramFollowers || "N/A"}
                </p>

                {selectedArtist.artistDetails &&
                      identityFields[selectedArtist.identity] && (
                        <div className="artist-extra-fields">
                          <h3>Professional Details</h3>

                          {identityFields[selectedArtist.identity].map(
                            ({ label, key }) => {
                              const value =
                                selectedArtist.artistDetails?.[selectedArtist.identity]?.[key];

                              return (
                                <p key={key}>
                                  <strong>{label}:</strong>{" "}
                                  {typeof value === "boolean"
                                    ? value
                                      ? "Yes"
                                      : "No"
                                    : value || "N/A"}
                                </p>
                              );
                            }
                          )}
                        </div>
                      )}

                <p>
                  <strong>Status:</strong> {selectedArtist.status || "pending"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Preview Overlay */}
        {previewMedia && (
          <div className="media-preview" onClick={() => setPreviewMedia(null)}>
            {previewMedia.type === "image" ? (
              <img
                src={previewMedia.src}
                alt="Preview"
                className="preview-content"
              />
            ) : (
              <video
                src={previewMedia.src}
                controls
                autoPlay
                className="preview-content"
              />
            )}
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default AdminArtistsPage;
