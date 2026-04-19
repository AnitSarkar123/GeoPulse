import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const detectNarratives = async (query) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/narrative/conflicts`, {
      query,
    });
    return response.data;
  } catch (error) {
    console.error("Narrative detection error:", error);
    return {
      success: false,
      message: "Failed to detect narratives",
      conflicts: [],
      error: error.response?.data || error.message,
    };
  }
};

export default {
  detectNarratives,
};
