// client/src/pages/user/MyBookings.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/my");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    setCancelling(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      await fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelling(null);
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "40px" }}>
        Loading your bookings...
      </p>
    );

  return (
    <div>
      <h1 className="page-title">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <h3>No bookings found</h3>
          <p>Book your first darshan today!</p>
        </div>
      ) : (
        <div>
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="card"
              style={{ marginBottom: "16px" }}
            >
              <div className="booking-row">
                <img
                  src={booking.temple?.image || "/temple-placeholder.jpg"}
                  alt={booking.temple?.templeName}
                  className="thumb"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/temple-placeholder.jpg";
                  }}
                />
                <div className="col">
                  <label>Temple</label>
                  <strong>{booking.temple?.templeName}</strong>
                </div>
                <div className="col">
                  <label>Darshan</label>
                  <strong>{booking.darshan?.darshanName}</strong>
                </div>
                <div className="col">
                  <label>Date & Time</label>
                  <strong>
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </strong>
                  <span style={{ fontSize: "0.8rem", display: "block" }}>
                    {booking.darshan?.startTime} - {booking.darshan?.endTime}
                  </span>
                </div>
                <div className="col">
                  <label>Type</label>
                  <strong>{booking.ticketType?.toUpperCase()}</strong>
                </div>
                <div className="col">
                  <label>Amount</label>
                  <strong>₹{booking.totalAmount}</strong>
                </div>
                <div className="col">
                  <label>Status</label>
                  <strong
                    style={{
                      color:
                        booking.status === "confirmed" ? "#28a745" : "#dc3545",
                    }}
                  >
                    {booking.status}
                  </strong>
                </div>
                {booking.status === "confirmed" && (
                  <div className="col">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancelling === booking._id}
                    >
                      {cancelling === booking._id ? "Cancelling..." : "Cancel"}
                    </button>
                  </div>
                )}
              </div>
              {/* QR Code placeholder - you can integrate qr-code library */}
              {booking.status === "confirmed" && (
                <div style={{ padding: "0 16px 16px", textAlign: "center" }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "10px",
                      background: "#f8f9fa",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                    }}
                  >
                    Booking ID: {booking._id.slice(-8).toUpperCase()}
                    <span style={{ marginLeft: "10px" }}>⬇ Scan for entry</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
