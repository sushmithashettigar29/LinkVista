import { useState } from "react";
import { useNavigate } from "react-router-dom";
import urlService from "../api/urlService";
import authService from "../api/auth";
import "../styles/Landing.css";

function Landing() {
  const [longUrl, setLongUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!longUrl) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = authService.getAuthToken();

      if (!token) {
        localStorage.setItem("pendingUrl", longUrl);
        navigate("/login");
        return;
      }

      if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://")) {
        throw new Error("URL must start with http:// or https://");
      }

      const response = await urlService.createShortUrl(longUrl);
      // console.log("Shorten Response:", response);

      navigate(`/link/${response.data.shortCode}`);

    } catch (error) {
      setError(error.message || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      <section className="hero-section">
        <h1>Smart URL Shortener with QR Code & Analytics</h1>
        <div className="url-input-container">
          <input
            type="text"
            placeholder="Enter your long URL here..."
            className="url-input"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />
          <button
            className="shorten-button"
            onClick={handleShorten}
            disabled={loading}
          >
            {loading ? "Shortening..." : "Shorten!"}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </section>

      <section className="features-section">
        <h2>Features</h2>
        <div className="features-boxes">
          <div className="feature">
            <img src="shortlink.svg" alt="" />
            <h3 className="gradient-text">Shorten Links</h3>
            <p>
              Turn <span className="span-color">long URLs</span> into{" "}
              <span className="span-color">short</span>, easy-to-share links
              with others.
            </p>
          </div>
          <div className="feature">
            <img src="qrcode.svg" alt="" />
            <h3 className="gradient-text">QR Code Ready</h3>
            <p>
              Auto-generate downloadable{" "}
              <span className="span-color">QR codes</span> for{" "}
              <span className="span-color">every short link</span>.
            </p>
          </div>
          <div className="feature">
            <img src="graph.svg" alt="" />
            <h3 className="gradient-text">Track Clicks</h3>
            <p>
              See <span className="span-color">total number of links</span>,
              which <span className="span-color">place</span>, and from which
              <span className="span-color"> device</span>.
            </p>
          </div>
          <div className="feature">
            <img src="security.svg" alt="" />
            <h3 className="gradient-text">Safe & Secure</h3>
            <p>
              User <span className="span-color">authentication</span> and secure{" "}
              <span className="span-color">dashboard</span> for very user.
            </p>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <h2>FAQs</h2>

        <details className="faq-item">
          <summary>
            How do I create a short link?
            <span className="arrow-icon">
              <img src="down-arrow.svg" alt="Toggle Arrow" />
            </span>
          </summary>
          <p>
            Simply paste your long URL in the input field above and click
            "Shorten".
          </p>
        </details>

        <details className="faq-item">
          <summary>
            Do I need to register?
            <span className="arrow-icon">
              <img src="down-arrow.svg" alt="Toggle Arrow" />
            </span>
          </summary>
          <p>
            Registration is required to track your links and view analytics.
          </p>
        </details>

        <details className="faq-item">
          <summary>
            What data does LinkVista track?
            <span className="arrow-icon">
              <img src="down-arrow.svg" alt="Toggle Arrow" />
            </span>
          </summary>
          <p>We track click counts, device types, and approximate locations.</p>
        </details>

        <details className="faq-item">
          <summary>
            Is it free to use?
            <span className="arrow-icon">
              <img src="down-arrow.svg" alt="Toggle Arrow" />
            </span>
          </summary>
          <p>Yes, LinkVista is completely free to use.</p>
        </details>

        <details className="faq-item">
          <summary>
            Can I see analytics for my links?
            <span className="arrow-icon">
              <img src="down-arrow.svg" alt="Toggle Arrow" />
            </span>
          </summary>
          <p>
            Yes, registered users can view detailed analytics for each link.
          </p>
        </details>
      </section>
    </div>
  );
}

export default Landing;
