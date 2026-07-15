// client/src/pages/organizer/OrganizerBookings.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const OrganizerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/organizer");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "40px" }}>
        Loading bookings...
      </p>
    );

  return (
    <div>
      <h1 className="page-title">Temple Bookings</h1>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          className={`btn ${filter === "all" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn ${filter === "confirmed" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setFilter("confirmed")}
        >
          Confirmed
        </button>
        <button
          className={`btn ${filter === "cancelled" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setFilter("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <h3>No bookings found</h3>
          <p>Bookings will appear here when devotees book darshans</p>
        </div>
      ) : (
        <div>
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="card"
              style={{ padding: "16px", marginBottom: "12px" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "12px",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "0.7rem",
                      color: "#666",
                      textTransform: "uppercase",
                    }}
                  >
                    Devotee
                  </label>
                  <div>
                    <strong>{booking.user?.name || "Unknown"}</strong>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#666" }}>
                    {booking.user?.email}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "0.7rem",
                      color: "#666",
                      textTransform: "uppercase",
                    }}
                  >
                    Darshan
                  </label>
                  <div>
                    <strong>{booking.darshan?.darshanName}</strong>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#666" }}>
                    {booking.darshan?.startTime} - {booking.darshan?.endTime}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "0.7rem",
                      color: "#666",
                      textTransform: "uppercase",
                    }}
                  >
                    Details
                  </label>
                  <div>
                    {booking.ticketType?.toUpperCase()} ×{" "}
                    {booking.numberOfTickets}
                  </div>
                  <div style={{ fontWeight: "600" }}>
                    ₹{booking.totalAmount}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "0.7rem",
                      color: "#666",
                      textTransform: "uppercase",
                    }}
                  >
                    Status
                  </label>
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
                        display: "inline-block",
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "0.7rem",
                      color: "#666",
                      textTransform: "uppercase",
                    }}
                  >
                    Booked On
                  </label>
                  <div style={{ fontSize: "0.85rem" }}>
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerBookings;
