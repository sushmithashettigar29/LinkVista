import axios from "axios";
import authService from "./auth";

const BASE_URL = "http://localhost:5000/api/url";

const createShortUrl = async (fullUrl) => {
  const token = authService.getAuthToken();
  const response = await axios.post(
    `${BASE_URL}/shorten`,
    { fullUrl },
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  return response.data;
};

const getLinkStats = async (shortCode) => {
  const token = authService.getAuthToken();
  const response = await axios.get(`${BASE_URL}/${shortCode}/stats`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

const getMyUrls = async (token) => {
  const response = await axios.get("http://localhost:5000/api/url/my", {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data.urls;
};

const deleteUrl = async (id, token) => {
  await axios.delete(`http://localhost:5000/api/url/${id}`, {
    headers: { Authorization: `${token}` },
  });
};

export default {
  createShortUrl,
  getLinkStats,
  getMyUrls,
  deleteUrl,
};
