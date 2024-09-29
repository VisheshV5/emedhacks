import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const register = (fName, lName, username, email, password) => {
  return axios.post(API_URL + "signup", {
    fName,
    lName,
    username,
    email,
    password,
  });
};

const login = async (username, password) => {
  console.log(username, password);
  const response = await axios.post(API_URL + "signin", {
    username,
    password,
  });
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const resetPasswordRequest = (email) => {
  return axios.post(API_URL + "reset-password-request", {
    email,
  });
};

const resetPassword = (token, newPassword) => {
  return axios.post(API_URL + "reset-password", {
    token,
    newPassword,
  });
};

const verifyToken = (token) => {
  return axios.get(API_URL + `validate-token/${token}`);
};

const logout = () => {
  localStorage.removeItem("user");
};

export default {
  register,
  login,
  logout,
  resetPasswordRequest,
  resetPassword,
  verifyToken,
};
