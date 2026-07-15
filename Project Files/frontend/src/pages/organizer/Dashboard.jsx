// client/src/pages/organizer/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axios.js";

const OrganizerDashboard = () => {
  const { auth } = useAuth();
  const [stats, setStats] = useState({ temples: 0, darshans: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        api.get("/admin/organizer-dashboard"),
        api.get("/bookings/organizer"),
      ]);
      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "40px" }}>
        Loading dashboard...
      </p>
    );

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
        <h3>Welcome, {auth?.name}! 👋</h3>
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

      {recentBookings.length > 0 && (
        <div>
          <h3>Recent Bookings</h3>
          <div style={{ marginTop: "12px" }}>
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="card"
                style={{ padding: "12px 16px", marginBottom: "8px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{booking.user?.name || "Unknown"}</strong>
                    <span style={{ margin: "0 10px", color: "#666" }}>•</span>
                    {booking.darshan?.darshanName}
                    <span style={{ margin: "0 10px", color: "#666" }}>•</span>
                    {booking.ticketType?.toUpperCase()}
                  </div>
                  <div>
                    <span
                      style={{
                        background:
                          booking.status === "confirmed"
                            ? "#d4edda"
                            : "#f8d7da",
                        color:
                          booking.status === "confirmed"
                            ? "#155724"
                            : "#721c24",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {booking.status}
                    </span>
                    <span style={{ marginLeft: "12px", fontWeight: "600" }}>
                      ₹{booking.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
