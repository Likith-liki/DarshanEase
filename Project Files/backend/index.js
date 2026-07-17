require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const connectDB = require("./config/db");
const { ensureDefaultAdmin } = require("./controllers/authController");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const templeRoutes = require("./routes/templeRoutes");
const darshanRoutes = require("./routes/darshanRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const organizerRoutes = require("./routes/organizerRoutes");
const adminRoutes = require("./routes/adminRoutes");


const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/temples", templeRoutes);
app.use("/api/darshans", darshanRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/organizers", organizerRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("DarshanEase API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  ensureDefaultAdmin();
  app.listen(PORT, () =>
    console.log(` Server running on http://localhost:${PORT}`),
  );
});
