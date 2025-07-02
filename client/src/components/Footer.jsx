import "../styles/Footer.css";

const Footer = () => {
  const socialLinks = {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    instagram: "https://instagram.com/yourusername",
  };
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">LinkVista</span>
        </div>
        <div className="footer-copyright">
          Copyright © {new Date().getFullYear()} LinkVista. All rights reserved.
        </div>
        <div className="social-icons">
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/github.svg" alt="" />
          </a>
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/linkedin.svg" alt="" />
          </a>
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/insta.svg" alt="" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
