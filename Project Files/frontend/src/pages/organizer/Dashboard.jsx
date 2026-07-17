// frontend/src/pages/organizer/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axios.js";

const OrganizerDashboard = () => {
  const { auth } = useAuth();
  const [stats, setStats] = useState({ temples: 0, darshans: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/admin/organizer-dashboard");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Organizer Dashboard</h1>

      <div
        style={{
          marginBottom: "24px",
          padding: "16px",
          background: "#e8f5e9",
          borderRadius: "8px",
        }}
      >
        <h3>Welcome, {auth?.name}! </h3>
        <p style={{ margin: 0 }}>Manage your temple and darshans efficiently</p>
      </div>

      <div className="stats-row">
        <div className="stat-card" style={{ background: "#e3f2fd" }}>
          <div> Temples</div>
          <div className="num">{stats.temples}</div>
        </div>
        <div className="stat-card" style={{ background: "#f3e5f5" }}>
          <div> Darshans</div>
          <div className="num">{stats.darshans}</div>
        </div>
        <div className="stat-card" style={{ background: "#fff3e0" }}>
          <div> Bookings</div>
          <div className="num">{stats.bookings}</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          margin: "24px 0",
        }}
      >
        <Link
          to="/organizer/temple"
          className="btn btn-teal"
          style={{ textAlign: "center", padding: "20px" }}
        >
          Manage Temple
        </Link>
        <Link
          to="/organizer/darshans"
          className="btn btn-primary"
          style={{ textAlign: "center", padding: "20px" }}
        >
          Manage Darshans
        </Link>
        <Link
          to="/organizer/darshans/new"
          className="btn btn-blue"
          style={{ textAlign: "center", padding: "20px" }}
        >
          Add New Darshan
        </Link>
        <Link
          to="/organizer/bookings"
          className="btn btn-outline"
          style={{ textAlign: "center", padding: "20px" }}
        >
          View All Bookings
        </Link>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
