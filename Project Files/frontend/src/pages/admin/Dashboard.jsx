// client/src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axios.js";

const AdminDashboard = () => {
  const { auth } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    organizers: 0,
    temples: 0,
    darshans: 0,
    bookings: 0,
  });
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch stats
  useEffect(() => {
    fetchStats();
    fetchRevenue();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/dashboard");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenue = async () => {
    try {
      const response = await api.get("/admin/revenue");
      setRevenue(response.data.totalRevenue || 0);
    } catch (error) {
      console.error("Error fetching revenue:", error);
    }
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", padding: "40px" }}>
        Loading dashboard...
      </p>
    );
  }

  return (
    <div>
      <h1 className="page-title">Admin Dashboard</h1>

      <div
        style={{
          marginBottom: "24px",
          padding: "16px",
          background: "#e8f5e9",
          borderRadius: "8px",
        }}
      >
        <h3>Welcome, {auth?.name}! </h3>
        <p style={{ margin: 0 }}>
          Manage users, organizers, temples, and darshans
        </p>
      </div>

      <div className="stats-row">
        <div className="stat-card" style={{ background: "#e3f2fd" }}>
          <div> Users</div>
          <div className="num">{stats.users}</div>
          <Link to="/admin/users" style={{ fontSize: "0.85rem" }}>
            View all →
          </Link>
        </div>
        <div className="stat-card" style={{ background: "#f3e5f5" }}>
          <div> Organizers</div>
          <div className="num">{stats.organizers}</div>
          <Link to="/admin/organizers" style={{ fontSize: "0.85rem" }}>
            View all →
          </Link>
        </div>
        <div className="stat-card" style={{ background: "#fff3e0" }}>
          <div> Temples</div>
          <div className="num">{stats.temples}</div>
          <Link to="/admin/temples" style={{ fontSize: "0.85rem" }}>
            View all →
          </Link>
        </div>
        <div className="stat-card" style={{ background: "#e8f5e9" }}>
          <div> Revenue</div>
          <div className="num">₹{revenue.toLocaleString()}</div>
          <Link to="/admin/revenue" style={{ fontSize: "0.85rem" }}>
            View details →
          </Link>
        </div>
        <div className="stat-card" style={{ background: "#fce4ec" }}>
          <div> Bookings</div>
          <div className="num">{stats.bookings}</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <Link
          to="/admin/users"
          className="btn btn-primary"
          style={{ textAlign: "center", padding: "16px" }}
        >
          Manage Users
        </Link>
        <Link
          to="/admin/organizers"
          className="btn btn-blue"
          style={{ textAlign: "center", padding: "16px" }}
        >
          Manage Organizers
        </Link>
        <Link
          to="/admin/temples"
          className="btn btn-teal"
          style={{ textAlign: "center", padding: "16px" }}
        >
          Manage Temples
        </Link>
        <Link
          to="/admin/revenue"
          className="btn btn-success"
          style={{
            textAlign: "center",
            padding: "16px",
            background: "#28a745",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Revenue Dashboard
        </Link>
      </div>

      {/* Chart placeholder */}
      <div className="chart-wrap" style={{ marginTop: "32px" }}>
        <h3 style={{ textAlign: "center", marginBottom: "16px" }}>
          System Overview
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-end",
            height: "200px",
            padding: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "40px",
                height: `${(stats.users / Math.max(...Object.values(stats))) * 180}px`,
                background: "#2196f3",
                borderRadius: "4px 4px 0 0",
                margin: "0 auto",
              }}
            ></div>
            <div style={{ fontSize: "0.7rem", marginTop: "4px" }}>Users</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "40px",
                height: `${(stats.organizers / Math.max(...Object.values(stats))) * 180}px`,
                background: "#9c27b0",
                borderRadius: "4px 4px 0 0",
                margin: "0 auto",
              }}
            ></div>
            <div style={{ fontSize: "0.7rem", marginTop: "4px" }}>
              Organizers
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "40px",
                height: `${(stats.temples / Math.max(...Object.values(stats))) * 180}px`,
                background: "#ff9800",
                borderRadius: "4px 4px 0 0",
                margin: "0 auto",
              }}
            ></div>
            <div style={{ fontSize: "0.7rem", marginTop: "4px" }}>Temples</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "40px",
                height: `${(stats.darshans / Math.max(...Object.values(stats))) * 180}px`,
                background: "#4caf50",
                borderRadius: "4px 4px 0 0",
                margin: "0 auto",
              }}
            ></div>
            <div style={{ fontSize: "0.7rem", marginTop: "4px" }}>Darshans</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "40px",
                height: `${(stats.bookings / Math.max(...Object.values(stats))) * 180}px`,
                background: "#f44336",
                borderRadius: "4px 4px 0 0",
                margin: "0 auto",
              }}
            ></div>
            <div style={{ fontSize: "0.7rem", marginTop: "4px" }}>Bookings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
