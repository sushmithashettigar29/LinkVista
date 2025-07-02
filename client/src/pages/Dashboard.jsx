/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import urlService from "../api/urlService";
import authService from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const token = authService.getAuthToken();
      const response = await urlService.getMyUrls(token);
      setUrls(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      const token = authService.getAuthToken();
      await urlService.deleteUrl(id, token);
      fetchUrls();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const totalLinks = urls.length;
  const totalClicks = urls.reduce((sum, u) => sum + u.clickCount, 0);

  if (loading) return <p className="loading">Loading your dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Dashboard</h2>
      <h2 className="dashboard-welcome">Welcome, {user?.name}!</h2>

      <div className="stats-box">
        <div className="stat-card">
          <p className="stat-number">{totalLinks}</p>
          <p className="stat-label">Total Links</p>
        </div>
        <div className="stat-card">
          <p className="stat-number">{totalClicks}</p>
          <p className="stat-label">Total Clicks</p>
        </div>
      </div>

      <h3 className="section-heading">Your Links</h3>

      <div className="link-list">
        {urls.map((url) => (
          <div className="link-card" key={url.id}>
            <div className="link-info">
              <a
                href={url.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="short-url"
              >
                {url.shortUrl}
              </a>
              <p className="full-url">{url.fullUrl}</p>
              <p className="click-count">Clicks: {url.clickCount}</p>
            </div>
            <div className="link-actions">
              <button
                onClick={() => navigate(`/link/${url.shortCode}`)}
                className="view-btn"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(url.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
