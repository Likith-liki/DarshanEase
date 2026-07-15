// client/src/pages/TempleDetail.jsx
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
  const [booking, setBooking] = useState({
    darshanId: "",
    ticketType: "normal",
    numberOfTickets: 1,
  });
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

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

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!auth) {
      navigate("/login");
      return;
    }
    if (auth.role !== "user") {
      setBookingMessage("Only devotees can book darshans");
      return;
    }

    setBookingLoading(true);
    setBookingMessage("");

    try {
      const response = await api.post("/bookings", {
        darshanId: booking.darshanId,
        ticketType: booking.ticketType,
        numberOfTickets: booking.numberOfTickets,
      });

      setBookingMessage(" Booking successful! Check your bookings.");
      setTimeout(() => navigate("/my-bookings"), 1500);
    } catch (error) {
      setBookingMessage(
        error.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
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
      <div
        style={{
          backgroundImage: `url(${temple.image || "/temple-placeholder.jpg"})`,
          backgroundSize: "cover",
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
          {temple.darshanStartTime} - {temple.darshanEndTime}
        </p>
        {temple.description && <p>{temple.description}</p>}
      </div>

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

              {auth?.role === "user" && darshan.availableSeats > 0 && (
                <div style={{ marginTop: "12px" }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setBooking({
                        darshanId: darshan._id,
                        ticketType: "normal",
                        numberOfTickets: 1,
                      });
                    }}
                  >
                    Book Now
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal/Form */}
      {booking.darshanId && (
        <div className="form-card" style={{ marginTop: "30px" }}>
          <h2>Book Darshan</h2>
          {bookingMessage && (
            <div
              className={
                bookingMessage.includes(" Booking successful!")
                  ? "success-msg"
                  : "error-msg"
              }
            >
              {bookingMessage}
            </div>
          )}
          <form onSubmit={handleBooking}>
            <div className="form-group">
              <label>Ticket Type</label>
              <select
                value={booking.ticketType}
                onChange={(e) =>
                  setBooking({ ...booking, ticketType: e.target.value })
                }
              >
                <option value="normal">Normal</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Number of Tickets</label>
              <input
                type="number"
                min="1"
                max="10"
                value={booking.numberOfTickets}
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    numberOfTickets: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={bookingLoading}
              >
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() =>
                  setBooking({
                    darshanId: "",
                    ticketType: "normal",
                    numberOfTickets: 1,
                  })
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TempleDetail;
