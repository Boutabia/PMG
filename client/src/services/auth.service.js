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

      return response.data;
    });
};

const logout = () => {
  console.log("logged out");
  localStorage.removeItem("user");
  localStorage.removeItem("expiration");
  //history.push("/login");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getExpiration = () => {
  let d = new Date();
    let exp = localStorage.getItem("expiration")
    if (exp) {
      const expired = exp <  d.getTime();
      if (expired) {
        logout();
        window.location.reload();
      }
    }
};

const auth = {
  login,
  logout,
  getCurrentUser,
  getExpiration
};

export default auth;