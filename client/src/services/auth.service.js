import axios from "axios";

export const API_URL = "http://localhost:3001/api/";

const login = (username, password) => {
  return axios
    .post(API_URL + "user/login", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data.accessToken));

        localStorage.setItem("expiration", JSON.stringify(response.data.expiration));
      }

      return response.accessToken;
    }, (error) => {
      console.log(error);
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  login,
  logout,
  getCurrentUser,
};