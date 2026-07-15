// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Temples from "./pages/Temples.jsx";
import TempleDetail from "./pages/TempleDetail.jsx";

import MyBookings from "./pages/user/MyBookings.jsx";

import OrganizerDashboard from "./pages/organizer/Dashboard.jsx";
import MyTemple from "./pages/organizer/MyTemple.jsx";
import UpdateTemple from "./pages/organizer/UpdateTemple.jsx";
import MyDarshans from "./pages/organizer/MyDarshans.jsx";
import DarshanForm from "./pages/organizer/DarshanForm.jsx";
import OrganizerBookings from "./pages/organizer/OrganizerBookings.jsx";

import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminUsers from "./pages/admin/Users.jsx";
import AdminOrganizers from "./pages/admin/Organizers.jsx";
import AdminTemples from "./pages/admin/Temples.jsx";

function App() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/temples" element={<Temples />} />
          <Route path="/temples/:id" element={<TempleDetail />} />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute role="user">
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/organizer/dashboard"
            element={
              <ProtectedRoute role="organizer">
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/temple"
            element={
              <ProtectedRoute role="organizer">
                <MyTemple />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/temple/edit"
            element={
              <ProtectedRoute role="organizer">
                <UpdateTemple />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/darshans"
            element={
              <ProtectedRoute role="organizer">
                <MyDarshans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/darshans/new"
            element={
              <ProtectedRoute role="organizer">
                <DarshanForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/darshans/:id/edit"
            element={
              <ProtectedRoute role="organizer">
                <DarshanForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/bookings"
            element={
              <ProtectedRoute role="organizer">
                <OrganizerBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/organizers"
            element={
              <ProtectedRoute role="admin">
                <AdminOrganizers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/temples"
            element={
              <ProtectedRoute role="admin">
                <AdminTemples />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
