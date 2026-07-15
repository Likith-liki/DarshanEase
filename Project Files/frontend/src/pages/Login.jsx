// pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let endpoint = "/auth/login";
      if (formData.role === "organizer") endpoint = "/auth/organizer/login";
      if (formData.role === "admin") endpoint = "/auth/admin/login";

      const response = await api.post(endpoint, {
        email: formData.email,
        password: formData.password,
      });

      const userData = response.data;
      login({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        token: userData.token,
      });

      // Redirect based on role
      if (userData.role === "user") navigate("/");
      else if (userData.role === "organizer") navigate("/organizer/dashboard");
      else if (userData.role === "admin") navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <img
          src="/login-temple.jpg"
          alt="Temple"
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/315x400/FF6B1A/FFFFFF?text=DarshanEase")
          }
        />
        <div className="form-side">
          <h2>Login to DarshanEase</h2>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Login as</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="user">Devotee</option>
                <option value="organizer">Organizer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
