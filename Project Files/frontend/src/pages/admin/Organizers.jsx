// client/src/pages/admin/Organizers.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const AdminOrganizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    try {
      const response = await api.get("/organizers");
      setOrganizers(response.data);
    } catch (error) {
      console.error("Error fetching organizers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/organizers", formData);
      setSuccess(" Organizer created successfully!");
      setFormData({ name: "", email: "", password: "", phone: "" });
      setShowForm(false);
      await fetchOrganizers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create organizer");
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      await api.patch(`/organizers/${id}/block`);
      await fetchOrganizers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to toggle block status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this organizer?"))
      return;

    try {
      await api.delete(`/organizers/${id}`);
      await fetchOrganizers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete organizer");
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "40px" }}>
        Loading organizers...
      </p>
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
          Manage Organizers
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? " Close" : " Add Organizer"}
        </button>
      </div>

      {showForm && (
        <div className="form-card" style={{ margin: "20px auto" }}>
          <h2>Create New Organizer</h2>
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Organizer
            </button>
          </form>
        </div>
      )}

      {organizers.length === 0 ? (
        <div className="empty-state">
          <h3>No organizers found</h3>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Temple</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizers.map((organizer) => (
                <tr key={organizer._id}>
                  <td>{organizer.name}</td>
                  <td>{organizer.email}</td>
                  <td>{organizer.phone || "-"}</td>
                  <td>{organizer.temple?.templeName || "Not assigned"}</td>
                  <td>
                    <span
                      style={{
                        color: organizer.isBlocked ? "#dc3545" : "#28a745",
                        fontWeight: "600",
                      }}
                    >
                      {organizer.isBlocked ? "Blocked" : "Active"}
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
                      onClick={() => handleToggleBlock(organizer._id)}
                    >
                      {organizer.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: "4px 12px", fontSize: "0.8rem" }}
                      onClick={() => handleDelete(organizer._id)}
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

export default AdminOrganizers;
