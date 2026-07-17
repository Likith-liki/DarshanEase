// frontend/src/pages/admin/RevenueDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const RevenueDashboard = () => {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueStats();
  }, [period]);

  const fetchRevenueStats = async () => {
    try {
      const response = await api.get(`/admin/revenue?period=${period}`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching revenue stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading revenue stats...</p>;
  if (!stats) return <p>No data available</p>;

  return (
    <div>
      <h1 className="page-title"> Revenue Dashboard</h1>

      {/* Period Selector */}
      <div style={{ marginBottom: "20px" }}>
        <label>Period: </label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="stats-row">
        <div className="stat-card" style={{ background: "#e8f5e9" }}>
          <div> Total Revenue</div>
          <div className="num">
            ₹{stats.totalRevenue?.toLocaleString() || 0}
          </div>
        </div>
        <div className="stat-card" style={{ background: "#e3f2fd" }}>
          <div> Total Bookings</div>
          <div className="num">{stats.totalBookings || 0}</div>
        </div>
        <div className="stat-card" style={{ background: "#fff3e0" }}>
          <div> Total Tickets</div>
          <div className="num">{stats.totalTickets || 0}</div>
        </div>
        <div className="stat-card" style={{ background: "#f3e5f5" }}>
          <div> Avg. Booking Value</div>
          <div className="num">
            ₹{stats.averageBookingValue?.toFixed(2) || 0}
          </div>
        </div>
      </div>

      {/* Revenue by Ticket Type */}
      <div className="card" style={{ padding: "20px", marginBottom: "20px" }}>
        <h3>Revenue by Ticket Type</h3>
        <div style={{ display: "flex", gap: "40px", marginTop: "12px" }}>
          <div>
            <strong>Normal Tickets</strong>
            <p style={{ fontSize: "1.5rem", color: "#2196f3" }}>
              ₹{stats.revenueByTicketType?.normal || 0}
            </p>
          </div>
          <div>
            <strong>VIP Tickets</strong>
            <p style={{ fontSize: "1.5rem", color: "#ff9800" }}>
              ₹{stats.revenueByTicketType?.vip || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Top Temples */}
      <div className="card" style={{ padding: "20px", marginBottom: "20px" }}>
        <h3>🏛️ Top Performing Temples</h3>
        {stats.topTemples?.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Temple</th>
                <th>Revenue</th>
                <th>Bookings</th>
                <th>Tickets</th>
              </tr>
            </thead>
            <tbody>
              {stats.topTemples.map((temple, index) => (
                <tr key={index}>
                  <td>{temple.name}</td>
                  <td>₹{temple.revenue}</td>
                  <td>{temple.bookings}</td>
                  <td>{temple.tickets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No temple data available</p>
        )}
      </div>

      {/* Top Darshans */}
      <div className="card" style={{ padding: "20px" }}>
        <h3> Top Performing Darshans</h3>
        {stats.topDarshans?.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Darshan</th>
                <th>Revenue</th>
                <th>Bookings</th>
                <th>Tickets</th>
              </tr>
            </thead>
            <tbody>
              {stats.topDarshans.map((darshan, index) => (
                <tr key={index}>
                  <td>{darshan.name}</td>
                  <td>₹{darshan.revenue}</td>
                  <td>{darshan.bookings}</td>
                  <td>{darshan.tickets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No darshan data available</p>
        )}
      </div>
    </div>
  );
};

export default RevenueDashboard;
