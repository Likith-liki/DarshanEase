// client/src/pages/admin/Temples.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

const AdminTemples = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    templeName: "",
    location: "",
    darshanStartTime: "",
    darshanEndTime: "",
    description: "",
    organizerId: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [organizers, setOrganizers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [templesRes, organizersRes] = await Promise.all([
        api.get("/temples"),
        api.get("/organizers"),
      ]);
      setTemples(templesRes.data);
      setOrganizers(organizersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      if (imageFile) data.append("image", imageFile);

      await api.post("/temples", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(" Temple created successfully!");
      setFormData({
        templeName: "",
        location: "",
        darshanStartTime: "",
        darshanEndTime: "",
        description: "",
        organizerId: "",
      });
      setImageFile(null);
      setShowForm(false);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create temple");
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      await api.patch(`/temples/${id}/block`);
      await fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to toggle block status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this temple?")) return;

    try {
      await api.delete(`/temples/${id}`);
      await fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete temple");
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "40px" }}>Loading temples...</p>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 className="page-title" style={{ margin: 0 }}>
          Manage Temples
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? " Close" : " Add Temple"}
        </button>
      </div>

      {showForm && (
        <div className="form-card" style={{ margin: "20px auto" }}>
          <h2>Create New Temple</h2>
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Temple Name</label>
              <input
                type="text"
                value={formData.templeName}
                onChange={(e) =>
                  setFormData({ ...formData, templeName: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Darshan Start Time</label>
                <input
                  type="time"
                  value={formData.darshanStartTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      darshanStartTime: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Darshan End Time</label>
                <input
                  type="time"
                  value={formData.darshanEndTime}
                  onChange={(e) =>
                    setFormData({ ...formData, darshanEndTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Assigned Organizer</label>
              <select
                value={formData.organizerId}
                onChange={(e) =>
                  setFormData({ ...formData, organizerId: e.target.value })
                }
              >
                <option value="">Select Organizer</option>
                {organizers.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name} ({org.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Temple Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Temple
            </button>
          </form>
        </div>
      )}

      {temples.length === 0 ? (
        <div className="empty-state">
          <h3>No temples found</h3>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Temple</th>
                <th>Location</th>
                <th>Organizer</th>
                <th>Darshan Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {temples.map((temple) => (
                <tr key={temple._id}>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <img
                        src={temple.image || "/temple-placeholder.jpg"}
                        alt={temple.templeName}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/temple-placeholder.jpg";
                        }}
                      />
                      {temple.templeName}
                    </div>
                  </td>
                  <td>{temple.location}</td>
                  <td>{temple.organizer?.name || "Unassigned"}</td>
                  <td>
                    {temple.darshanStartTime} - {temple.darshanEndTime}
                  </td>
                  <td>
                    <span
                      style={{
                        color: temple.isBlocked ? "#dc3545" : "#28a745",
                        fontWeight: "600",
                      }}
                    >
                      {temple.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-teal"
                      style={{
                        padding: "4px 12px",
                        fontSize: "0.8rem",
                        marginRight: "4px",
                      }}
                      onClick={() => handleToggleBlock(temple._id)}
                    >
                      {temple.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <Link
                      to={`/temples/${temple._id}`}
                      className="btn btn-blue"
                      style={{
                        padding: "4px 12px",
                        fontSize: "0.8rem",
                        marginRight: "4px",
                        display: "inline-block",
                      }}
                    >
                      View
                    </Link>
                    <button
                      className="btn btn-danger"
                      style={{ padding: "4px 12px", fontSize: "0.8rem" }}
                      onClick={() => handleDelete(temple._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTemples;
