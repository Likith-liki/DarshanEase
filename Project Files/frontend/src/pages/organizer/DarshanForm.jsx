// client/src/pages/organizer/DarshanForm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const DarshanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    darshanName: "",
    startTime: "",
    endTime: "",
    normalPrice: 0,
    vipPrice: 0,
    description: "",
    availableSeats: 100,
  });

  useEffect(() => {
    if (isEdit) {
      fetchDarshan();
    }
  }, [id]);

  const fetchDarshan = async () => {
    try {
      const response = await api.get(`/darshans/${id}`);
      const data = response.data;
      setFormData({
        darshanName: data.darshanName || "",
        startTime: data.startTime || "",
        endTime: data.endTime || "",
        normalPrice: data.normalPrice || 0,
        vipPrice: data.vipPrice || 0,
        description: data.description || "",
        availableSeats: data.availableSeats || 100,
      });
    } catch (error) {
      setError("Error loading darshan details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (isEdit) {
        await api.put(`/darshans/${id}`, formData);
        setSuccess("Darshan updated successfully!");
      } else {
        await api.post("/darshans", formData);
        setSuccess("Darshan created successfully!");
      }

      setTimeout(() => navigate("/organizer/darshans"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Operation failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>;

  return (
    <div>
      <h1 className="page-title">
        {isEdit ? "Edit Darshan" : "Create New Darshan"}
      </h1>

      <div className="form-card">
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Darshan Name</label>
            <input
              type="text"
              name="darshanName"
              value={formData.darshanName}
              onChange={handleChange}
              required
              placeholder="e.g., Morning Aarti, Evening Darshan"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Normal Price (₹)</label>
              <input
                type="number"
                name="normalPrice"
                value={formData.normalPrice}
                onChange={handleChange}
                min="0"
                step="10"
                required
              />
            </div>
            <div className="form-group">
              <label>VIP Price (₹)</label>
              <input
                type="number"
                name="vipPrice"
                value={formData.vipPrice}
                onChange={handleChange}
                min="0"
                step="10"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Available Seats</label>
            <input
              type="number"
              name="availableSeats"
              value={formData.availableSeats}
              onChange={handleChange}
              min="1"
              max="999"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Special instructions or details about this darshan"
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : isEdit
                  ? "Update Darshan"
                  : "Create Darshan"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/organizer/darshans")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DarshanForm;
