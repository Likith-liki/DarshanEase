// components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // If not logged in - show public navbar
  if (!auth) {
    return (
      <nav className="navbar">
        <Link className="brand" to="/">
          DarshanEase
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/temples">Temples</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>
    );
  }

  // User logged in
  if (auth.role === "user") {
    return (
      <nav className="navbar">
        <span className="brand">Darshan-Ease</span>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/temples">Temples</Link>
          <Link to="/my-bookings">My Bookings</Link>
          <button onClick={handleLogout}>Logout ({auth.name})</button>
        </div>
      </nav>
    );
  }

  // Organizer logged in
  if (auth.role === "organizer") {
    return (
      <nav className="navbar">
        <span className="brand">DarshanEase (Organizer)</span>
        <div className="nav-links">
          <Link to="/organizer/dashboard">Dashboard</Link>
          <Link to="/organizer/temple">My Temple</Link>
          <Link to="/organizer/darshans">Darshans</Link>
          <Link to="/organizer/bookings">Bookings</Link>
          <button onClick={handleLogout}>Logout ({auth.name})</button>
        </div>
      </nav>
    );
  }

  // Admin logged in
  if (auth.role === "admin") {
    return (
      <nav className="navbar">
        <span className="brand">Darshan-Ease (Admin)</span>
        <div className="nav-links">
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/organizers">Organizers</Link>
          <Link to="/admin/temples">Temples</Link>
          <button onClick={handleLogout}>Logout ({auth.name})</button>
        </div>
      </nav>
    );
  }

  return null;
};

export default Navbar;
