// client/src/pages/Temples.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const Temples = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTemples();
  }, []);

  const fetchTemples = async () => {
    try {
      const response = await api.get("/temples");
      setTemples(response.data);
    } catch (error) {
      console.error("Error fetching temples:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemples = temples.filter(
    (temple) =>
      temple.templeName.toLowerCase().includes(search.toLowerCase()) ||
      temple.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1 className="page-title">All Temples</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search temples by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "1rem",
          }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading temples...</p>
      ) : filteredTemples.length === 0 ? (
        <div className="empty-state">
          <h3>No temples found</h3>
          <p>Try adjusting your search</p>
        </div>
      ) : (
        <div className="temple-grid">
          {filteredTemples.map((temple) => (
            <div key={temple._id} className="card temple-card">
              <img
                src={temple.image || "/temple-placeholder.jpg"}
                alt={temple.templeName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/temple-placeholder.jpg";
                }}
              />
              <div className="body">
                <h3>{temple.templeName}</h3>
                <p> {temple.location}</p>
                <div className="times">
                  <span>🕐 {temple.darshanStartTime}</span>
                  <span>to {temple.darshanEndTime}</span>
                </div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#666",
                    marginTop: "8px",
                  }}
                >
                  {temple.description?.substring(0, 80)}...
                </p>
                <Link
                  to={`/temples/${temple._id}`}
                  className="btn btn-primary"
                  style={{ marginTop: "10px" }}
                >
                  View Darshans
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Temples;
