// frontend/src/pages/TempleDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const TempleDetail = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [temple, setTemple] = useState(null);
  const [darshans, setDarshans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDarshan, setSelectedDarshan] = useState(null);
  const [bookingData, setBookingData] = useState({
    ticketType: "normal",
    numberOfTickets: 1,
  });
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchTempleAndDarshans();
  }, [id]);

  const fetchTempleAndDarshans = async () => {
    try {
      const [templeRes, darshanRes] = await Promise.all([
        api.get(`/temples/${id}`),
        api.get(`/darshans/temple/${id}`),
      ]);
      setTemple(templeRes.data);
      setDarshans(darshanRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total amount
  const calculateTotal = () => {
    if (!selectedDarshan) return 0;
    const price =
      bookingData.ticketType === "vip"
        ? selectedDarshan.vipPrice
        : selectedDarshan.normalPrice;
    return price * bookingData.numberOfTickets;
  };

  // Handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault(); // 1. Prevent page refresh

    // 2. Check if user is logged in and has the correct role
    if (!auth) {
      setBookingMessage("⚠️ Please login to book a darshan");
      return;
    }
    if (auth.role !== "user") {
      setBookingMessage("⚠️ Only devotees can book darshans");
      return;
    }

    setBookingLoading(true); // 3. Show loading state
    setBookingMessage("");

    try {
      // 4. Send booking data to the backend API
      const response = await api.post("/bookings", {
        darshanId: selectedDarshan._id,
        ticketType: bookingData.ticketType,
        numberOfTickets: bookingData.numberOfTickets,
      });

      // 5. Handle successful response
      setBookingMessage("✅ Booking successful! 🎉");
      // ... redirect to My Bookings page
    } catch (error) {
      // 6. Handle errors (e.g., no seats left)
      setBookingMessage(error.response?.data?.message || "❌ Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Open booking form for a specific darshan
  const openBookingForm = (darshan) => {
    if (darshan.availableSeats <= 0) {
      setBookingMessage(" No seats available for this darshan");
      return;
    }
    setSelectedDarshan(darshan);
    setShowBookingForm(true);
    setBookingMessage("");
    setBookingData({
      ticketType: "normal",
      numberOfTickets: 1,
    });
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "40px" }}>
        Loading temple details...
      </p>
    );
  if (!temple)
    return (
      <div className="empty-state">
        <h3>Temple not found</h3>
      </div>
    );

  return (
    <div>
      {/* Temple Hero Section */}
      <div
        style={{
          background: `url("/temple-placeholder.jpg")`,
          backgroundSize: "cover",
          height: "700px",
          backgroundPosition: "center",
          padding: "60px 20px",
          borderRadius: "10px",
          margin: "20px 0",
          color: "white",
          textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
        }}
      >
        <h1>{temple.templeName}</h1>
        <p> {temple.location}</p>
        <p>
          {" "}
          {temple.darshanStartTime} - {temple.darshanEndTime}
        </p>
        {temple.description && <p>{temple.description}</p>}
      </div>

      {/* Darshan List */}
      <h2 className="page-title">Available Darshans</h2>

      {darshans.length === 0 ? (
        <div className="empty-state">
          <h3>No darshans available</h3>
          <p>Check back later for new slots</p>
        </div>
      ) : (
        <div className="darshan-grid">
          {darshans.map((darshan) => (
            <div key={darshan._id} className="card darshan-card">
              <h4>{darshan.darshanName}</h4>
              <p>
                {" "}
                {darshan.startTime} - {darshan.endTime}
              </p>
              <p>
                {" "}
                Normal: ₹{darshan.normalPrice} | VIP: ₹{darshan.vipPrice}
              </p>
              <p> Available Seats: {darshan.availableSeats}</p>
              {darshan.description && (
                <p style={{ fontSize: "0.85rem", color: "#666" }}>
                  {darshan.description}
                </p>
              )}

              {/* Book Now Button */}
              {darshan.availableSeats > 0 ? (
                <button
                  className="btn btn-primary"
                  onClick={() => openBookingForm(darshan)}
                  style={{ marginTop: "12px", width: "100%" }}
                >
                  Book Now
                </button>
              ) : (
                <button
                  className="btn btn-outline"
                  disabled
                  style={{ marginTop: "12px", width: "100%", opacity: 0.6 }}
                >
                  Fully Booked
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && selectedDarshan && (
        <div
          className="booking-modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            className="form-card"
            style={{
              background: "white",
              color: "#222",
              maxWidth: "500px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              padding: "30px",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0 }}>Book Darshan</h2>
              <button
                onClick={() => {
                  setShowBookingForm(false);
                  setSelectedDarshan(null);
                  setBookingMessage("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ✕
              </button>
            </div>

            {/* Darshan Details */}
            <div
              style={{
                background: "#f8f9fa",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <h4 style={{ margin: 0 }}>{selectedDarshan.darshanName}</h4>
              <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>
                {" "}
                {selectedDarshan.startTime} - {selectedDarshan.endTime}
              </p>
              <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>
                {" "}
                Available: {selectedDarshan.availableSeats} seats
              </p>
            </div>

            {bookingMessage && (
              <div
                className={
                  bookingMessage.includes("✅") ? "success-msg" : "error-msg"
                }
              >
                {bookingMessage}
              </div>
            )}

            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label>Ticket Type</label>
                <select
                  value={bookingData.ticketType}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      ticketType: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                  }}
                >
                  <option value="normal">
                    Normal - ₹{selectedDarshan.normalPrice}
                  </option>
                  <option value="vip">VIP - ₹{selectedDarshan.vipPrice}</option>
                </select>
              </div>

              <div className="form-group">
                <label>Number of Tickets</label>
                <input
                  type="number"
                  min="1"
                  max={Math.min(10, selectedDarshan.availableSeats)}
                  value={bookingData.numberOfTickets}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      numberOfTickets: parseInt(e.target.value) || 1,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                  }}
                />
                <small style={{ color: "#666" }}>
                  Max: {Math.min(10, selectedDarshan.availableSeats)} tickets
                </small>
              </div>

              {/* Total Amount */}
              <div
                style={{
                  background: "#e8f5e9",
                  padding: "12px",
                  borderRadius: "8px",
                  margin: "16px 0",
                  textAlign: "center",
                }}
              >
                <strong>Total Amount: ₹{calculateTotal()}</strong>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={bookingLoading}
                  style={{ flex: 1, padding: "12px" }}
                >
                  {bookingLoading ? "Processing..." : "Confirm Booking"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowBookingForm(false);
                    setSelectedDarshan(null);
                    setBookingMessage("");
                  }}
                  style={{ padding: "12px 24px" }}
                >
                  Cancel
                </button>
              </div>

              {!auth && (
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "12px",
                    color: "#ff6b1a",
                  }}
                >
                  Please <a href="/login">login</a> to book a darshan
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TempleDetail;
