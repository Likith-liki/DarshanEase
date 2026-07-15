import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const Home = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemples();
  }, []);

  const fetchTemples = async () => {
    try {
      const response = await api.get("/temples");
      setTemples(response.data.slice(0, 6));
    } catch (error) {
      console.error("Error fetching temples:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="hero">
        <img
          src="/hero-temple.jpg"
          alt="Temple Hero"
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/1200x320/FF6B1A/FFFFFF?text=Temple+Darshan")
          }
        />
        <div className="ticker">
          Book your Darshan slot now! Special VIP Darshan available for limited
          slots.
        </div>
      </div>

      <h2 className="page-title">Featured Temples</h2>
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading temples...</p>
      ) : (
        <div className="temple-grid">
          {temples.map((temple) => (
            <div key={temple._id} className="card temple-card">
              <img
                src={temple.image || "/temple-placeholder.jpg"}
                alt={temple.templeName}
                onError={(e) => (e.target.src = "/temple-placeholder.jpg")}
              />
              <div className="body">
                <h3>{temple.templeName}</h3>
                <p> {temple.location}</p>
                <div className="times">
                  <span> {temple.darshanStartTime}</span>
                  <span>to {temple.darshanEndTime}</span>
                </div>
                <Link
                  to={`/temples/${temple._id}`}
                  className="btn btn-primary"
                  style={{ marginTop: "10px" }}
                >
                  View Darshans
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
