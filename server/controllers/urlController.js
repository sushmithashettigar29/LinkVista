const axios = require("axios");
const Url = require("../models/Url");
const crypto = require("crypto");
const Click = require("../models/Click");
const QRCode = require("qrcode");

const createShortUrl = async (req, res) => {
  try {
    const { fullUrl } = req.body;

    if (!fullUrl) {
      return res.status(400).json({ msg: "Full URL is required." });
    }

    const shortCode = crypto.randomBytes(3).toString("hex");
    const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;

    const qrCode = await QRCode.toDataURL(shortUrl);

    const newUrl = new Url({
      fullUrl,
      shortCode,
      createdBy: req.user.id,
      qrCode,
    });

    await newUrl.save();

    res.status(201).json({
      msg: "Short URL created",
      shortUrl,
      qrCode,
      data: newUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const handleRedirect = async (req, res) => {
  try {
    const shortCode = req.params.shortCode;
    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) {
      return res.status(404).json({ msg: "Short URL not found" });
    }

    const userAgent = req.headers["user-agent"];
    // const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    // const geo = geoip.lookup(ip);
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    let location = "Unknown";
    try {
      const geo = await axios.get(`http://ip-api.com/json/${ip}`);
      if (geo.data?.status === "success") {
        location = `${geo.data.country}, ${geo.data.city}`;
      }
    } catch (err) {
      console.error("Location fetch failed:", err.message);
    }

    const deviceType = /mobile/i.test(userAgent)
      ? "Mobile"
      : /tablet/i.test(userAgent)
      ? "Tablet"
      : "Desktop";

    await Click.create({
      shortCode,
      deviceType,
      location,
    });

    urlDoc.clickCount += 1;
    await urlDoc.save();

    return res.redirect(urlDoc.fullUrl);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getMyUrls = async (req, res) => {
  try {
    const userId = req.user.id;

    const urls = await Url.find({ createdBy: userId }).sort({ createdAt: -1 });

    const formattedUrls = urls.map((url) => ({
      id: url._id,
      fullUrl: url.fullUrl,
      shortCode: url.shortCode,
      shortUrl: `${req.protocol}://${req.get("host")}/${url.shortCode}`,
      qrCode: url.qrCode,
      clickCount: url.clickCount,
      createdAt: url.createdAt,
    }));

    res.json({ urls: formattedUrls });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error fetching URLs" });
  }
};

const deleteUrl = async (req, res) => {
  try {
    const urlId = req.params.id;

    const url = await Url.findById(urlId);
    if (!url) {
      return res.status(404).json({ msg: "URL not found" });
    }

    if (url.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized to delete this URL." });
    }

    await Url.findByIdAndDelete(urlId);
    res.json({ msg: "URL deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error deleting URL" });
  }
};

const getClickStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ msg: "URL not found" });
    }

    if (url.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized to delete this URL." });
    }

    const clicks = await Click.find({ shortCode });

    const totalClicks = clicks.length;

    const deviceStats = {};
    const locationStats = {};

    clicks.forEach((click) => {
      const device = click.deviceType || "Unknown";
      deviceStats[device] = (deviceStats[device] || 0) + 1;

      const location = click.location || "Unknown";
      locationStats[location] = (locationStats[location] || 0) + 1;
    });

    res.json({
      shortCode,
      totalClicks,
      deviceStats,
      locationStats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error fetching click state" });
  }
};

module.exports = {
  createShortUrl,
  handleRedirect,
  getMyUrls,
  deleteUrl,
  getClickStats,
};
