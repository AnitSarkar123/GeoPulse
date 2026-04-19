import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const filterPerspectives = async (articles) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/perspectives/filter`, {
      articles,
    });
    return response.data;
  } catch (error) {
    console.error("Perspective filter error:", error);
    return {
      success: false,
      message: "Failed to filter perspectives",
      perspectives: [],
      error: error.response?.data || error.message,
    };
  }
};

export default {
  filterPerspectives,
};
