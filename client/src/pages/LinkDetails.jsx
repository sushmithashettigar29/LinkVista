/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import urlService from "../api/urlService";
import authService from "../api/auth";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../styles/LinkDetails.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function LinkDetails() {
  const { shortCode } = useParams();
  const [stats, setStats] = useState(null);
  const [urlData, setUrlData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = authService.getAuthToken();
        const allUrls = await urlService.getMyUrls(token);
        const match = allUrls.find((url) => url.shortCode === shortCode);
        if (!match) return setError("Link not found");
        setUrlData(match);
        const statsData = await urlService.getLinkStats(shortCode);
        setStats(statsData);
      } catch (err) {
        setError("Failed to load data");
      }
    };
    fetchDetails();
  }, [shortCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(urlData.shortUrl);
    alert("Short URL copied!");
  };

  const handleDelete = async () => {
    const token = authService.getAuthToken();
    if (window.confirm("Are you sure you want to delete this link?")) {
      try {
        await urlService.deleteUrl(urlData.id, token);
        navigate("/dashboard");
      } catch (e) {
        alert("Delete failed");
      }
    }
  };

  const handleDownloadQR = () => {
    const a = document.createElement("a");
    a.href = urlData.qrCode;
    a.download = `qr-${shortCode}.png`;
    a.click();
  };

  if (error) return <p className="error">{error}</p>;
  if (!stats || !urlData) return <p className="loading">Loading...</p>;

  const deviceChart = {
    labels: Object.keys(stats.deviceStats),
    datasets: [
      {
        label: "Devices",
        data: Object.values(stats.deviceStats),
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
      },
    ],
  };

  const locationChart = {
    labels: Object.keys(stats.locationStats),
    datasets: [
      {
        label: "Locations",
        data: Object.values(stats.locationStats),
        backgroundColor: ["#9c27b0", "#03a9f4", "#ff5722", "#607d8b"],
      },
    ],
  };

  return (
    <div className="link-details-container">
      <h2 className="page-title">Link Overview</h2>
      <div className="link-details-grid">
        {/* Left Column */}
        <div className="left-content">
          <div className="short-url-box">
            <a href={urlData.shortUrl} target="_blank" rel="noreferrer">
              {urlData.shortUrl}
            </a>
            <button onClick={handleCopy} className="copy-btn-box">
              <img src="/copy.svg" alt="Copy" />
            </button>
          </div>

          <p className="full-url">
            <img src="/link.svg" alt="Link" />
            <span>{urlData.fullUrl}</span>
          </p>
          <p className="timestamp">
            <img src="/time.svg" alt="Time" />
            <span>{new Date(urlData.createdAt).toLocaleString()}</span>
          </p>
          <button className="btn-style" onClick={handleDelete}>
            <img src="/delete.svg" alt="" />
            Delete Link
          </button>
          <div className="qr-section">
            <img className="qr-img" src={urlData.qrCode} alt="QR Code" />
            <div className="qr-actions">
              <button onClick={handleCopy} className="btn-style copy-btn">
                <img src="/copy-qr.svg" alt="" />
                Copy QR Code
              </button>
              <button
                onClick={handleDownloadQR}
                className="btn-style download-btn"
              >
                <img src="/download.svg" alt="" />
                Download QR Code
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-content">
          <div className="total-clicks">
            <h4>Total Clicks</h4>{" "}
            <p>
              <span>{stats.totalClicks}</span>{" "}
            </p>
          </div>

          <div className="chart-box">
            <h4>Device Stats</h4>
            <div className="pie-chart">
              <Pie data={deviceChart} />
            </div>
          </div>

          <div className="chart-box">
            <h4>Location Stats</h4>
            <div className="pie-chart">
              <Pie data={locationChart} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinkDetails;
