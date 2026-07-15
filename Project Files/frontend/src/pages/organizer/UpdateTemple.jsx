// client/src/pages/organizer/UpdateTemple.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const UpdateTemple = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    templeName: "",
    location: "",
    darshanStartTime: "",
    darshanEndTime: "",
    description: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchTemple();
  }, []);

  const fetchTemple = async () => {
    try {
      const response = await api.get("/temples/my/temple");
      const temple = response.data;
      setFormData({
        templeName: temple.templeName || "",
        location: temple.location || "",
        darshanStartTime: temple.darshanStartTime || "",
        darshanEndTime: temple.darshanEndTime || "",
        description: temple.description || "",
        image: temple.image || "",
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setError("No temple assigned to you. Please contact admin.");
      } else {
        setError("Error loading temple details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      if (imageFile) data.append("image", imageFile);

      await api.put("/temples/my/temple", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(" Temple updated successfully!");
      setTimeout(() => navigate("/organizer/temple"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Update failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>;

  return (
    <div>
      <h1 className="page-title">Update Temple</h1>

      <div className="form-card">
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Temple Name</label>
            <input
              type="text"
              name="templeName"
              value={formData.templeName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Darshan Start Time</label>
              <input
                type="time"
                name="darshanStartTime"
                value={formData.darshanStartTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Darshan End Time</label>
              <input
                type="time"
                name="darshanEndTime"
                value={formData.darshanEndTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Temple Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {formData.image && !imageFile && (
              <p style={{ fontSize: "0.8rem", marginTop: "4px" }}>
                Current image uploaded ✓
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Temple"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/organizer/temple")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTemple;
