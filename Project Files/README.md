🏛️ DarshanEase - Temple Darshan Ticket Booking System

## 📌 Overview
DarshanEase is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application that allows devotees to book darshan tickets for temples, manage bookings, and provides admin/organizer dashboards for efficient temple management.

## ✨ Features

### 👤 User Features
- User Registration & Authentication
- Browse Temples and Darshan Slots
- Book Darshan Tickets (Normal/VIP)
- View Booking History
- Cancel Bookings
- QR Code for Booking Confirmation

### 🏛️ Organizer Features
- Dashboard with Statistics
- Manage Temple Details
- Create/Update/Delete Darshan Slots
- View and Manage Bookings
- Update Temple Information

### 👑 Admin Features
- Full System Management Dashboard
- Manage Users, Organizers, and Temples
- Create/Block/Delete Organizers
- Manage All Temples and Darshans
- System Analytics

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite
- **React Router** for Navigation
- **Axios** for API Calls
- **CSS3** with Custom Styles

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** Authentication
- **bcryptjs** for Password Hashing
- **Multer** for File Uploads
- **QRCode** for Ticket Generation

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

### Backend Setup
\`\`\`bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials
# PORT=8000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret

# Start backend server
npm run dev
\`\`\`

### Frontend Setup
\`\`\`bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with backend URL
# VITE_API_URL=http://localhost:8000/api

# Start frontend server
npm run dev
\`\`\`

## 🔐 Default Admin Credentials
- **Email:** admin@darshanease.com
- **Password:** admin123

## 📁 Project Structure
\`\`\`
DarshanEase/
├── backend/
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── .env
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── api/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── .env
│   └── package.json
├── .gitignore
└── README.md
\`\`\`

## 🎯 API Endpoints

### Authentication
- \`POST /api/auth/register\` - User Registration
- \`POST /api/auth/login\` - User Login
- \`POST /api/auth/organizer/login\` - Organizer Login
- \`POST /api/auth/admin/login\` - Admin Login

### Temples
- \`GET /api/temples\` - Get All Temples
- \`GET /api/temples/:id\` - Get Temple by ID
- \`POST /api/temples\` - Create Temple (Admin)
- \`PUT /api/temples/:id\` - Update Temple (Admin)

### Darshans
- \`GET /api/darshans/temple/:templeId\` - Get Darshans by Temple
- \`POST /api/darshans\` - Create Darshan (Organizer)
- \`PUT /api/darshans/:id\` - Update Darshan (Organizer)

### Bookings
- \`POST /api/bookings\` - Create Booking
- \`GET /api/bookings/my\` - Get User Bookings
- \`PUT /api/bookings/:id/cancel\` - Cancel Booking

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License
This project is for educational purposes.

## 👥 Authors
- Your Name - Initial work

## 🙏 Acknowledgments
- MongoDB for the database
- React and Node.js communities
- All contributors

---
Made with ❤️ for the spiritual community
" > README.md
