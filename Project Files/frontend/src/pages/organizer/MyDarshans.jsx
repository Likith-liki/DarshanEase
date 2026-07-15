// client/src/pages/organizer/MyDarshans.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

const MyDarshans = () => {
  const [darshans, setDarshans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDarshans();
  }, []);

  const fetchDarshans = async () => {
    try {
      const response = await api.get("/darshans/my/darshans");
      setDarshans(response.data);
    } catch (error) {
      console.error("Error fetching darshans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this darshan?"))
      return;

    try {
      await api.delete(`/darshans/${id}`);
      await fetchDarshans();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete darshan");
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "40px" }}>
        Loading darshans...
      </p>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h1 className="page-title" style={{ margin: 0 }}>
          My Darshans
        </h1>
        <Link to="/organizer/darshans/new" className="btn btn-primary">
          Add New Darshan
        </Link>
      </div>

      {darshans.length === 0 ? (
        <div className="empty-state">
          <h3>No darshans created</h3>
          <p>Create your first darshan slot now!</p>
          <Link
            to="/organizer/darshans/new"
            className="btn btn-primary"
            style={{ marginTop: "16px" }}
          >
            Create Darshan
          </Link>
        </div>
      ) : (
        <div className="darshan-grid">
          {darshans.map((darshan) => (
            <div key={darshan._id} className="card darshan-card">
              <h4>{darshan.darshanName}</h4>
              <p>
                {darshan.startTime} - {darshan.endTime}
              </p>
              <p>
                Normal: ₹{darshan.normalPrice} | VIP: ₹{darshan.vipPrice}
              </p>
              <p> Available Seats: {darshan.availableSeats}</p>
              {darshan.description && (
                <p style={{ fontSize: "0.85rem", color: "#666" }}>
                  {darshan.description}
                </p>
              )}

              <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                <Link
                  to={`/organizer/darshans/${darshan._id}/edit`}
                  className="btn btn-teal"
                  style={{ fontSize: "0.8rem" }}
                >
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  style={{ fontSize: "0.8rem" }}
                  onClick={() => handleDelete(darshan._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDarshans;
