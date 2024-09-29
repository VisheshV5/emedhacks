import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";
const USER_URL = "http://localhost:8080/api/user/";

export const findUserById = async (userId) => {
  try {
    const response = await axios.get(USER_URL + userId);
    console.log(response.data.message);
    return response.data.message;
  } catch (error) {
    console.error("Error fetching profile image:", error);
  }
};

export const createPreferences = async (userId, preferenceData) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/user/create/${userId}`,
      preferenceData
    );
    return response.data;
  } catch (error) {
    console.error("Error generating preferences:", error);
    throw error;
  }
};

export const checkSymptoms = async (userId, symptoms) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/user/check/${userId}`,
      symptoms
    );
    return response.data;
  } catch (error) {
    console.error("Error generating preferences:", error);
    throw error;
  }
};

