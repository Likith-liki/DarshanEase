// client/src/pages/organizer/MyTemple.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

const MyTemple = () => {
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemple();
  }, []);

  const fetchTemple = async () => {
    try {
      const response = await api.get("/temples/my/temple");
      setTemple(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setTemple(null);
      } else {
        console.error("Error fetching temple:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "40px" }}>
        Loading temple details...
      </p>
    );

  if (!temple) {
    return (
      <div>
        <h1 className="page-title">My Temple</h1>
        <div className="empty-state">
          <h3>No Temple Assigned</h3>
          <p>Contact admin to get a temple assigned to you</p>
          <Link
            to="/organizer/dashboard"
            className="btn btn-primary"
            style={{ marginTop: "16px" }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">My Temple</h1>

      <div className="card" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <img
          src={temple.image || "/temple-placeholder.jpg"}
          alt={temple.templeName}
          style={{ width: "100%", height: "250px", objectFit: "cover" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/temple-placeholder.jpg";
          }}
        />
        <div style={{ padding: "24px" }}>
          <h2>{temple.templeName}</h2>
          <p style={{ fontSize: "1.1rem" }}>📍 {temple.location}</p>
          <div style={{ display: "flex", gap: "20px", margin: "16px 0" }}>
            <div>
              <strong>Darshan Start</strong>
              <p>{temple.darshanStartTime}</p>
            </div>
            <div>
              <strong>Darshan End</strong>
              <p>{temple.darshanEndTime}</p>
            </div>
          </div>
          {temple.description && (
            <div>
              <strong>Description</strong>
              <p>{temple.description}</p>
            </div>
          )}
          <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
            <Link to="/organizer/temple/edit" className="btn btn-primary">
              Update Temple
            </Link>
            <Link to="/organizer/darshans" className="btn btn-teal">
              Manage Darshans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTemple;
