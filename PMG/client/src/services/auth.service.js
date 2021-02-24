import axios from "axios";

export const API_URL = "https://tuni-pmg.herokuapp.com/api/";

const login = (username, password) => {
  return axios
    .post(API_URL + "user/login", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken && username ==="superuser" ) {
        localStorage.setItem("user", JSON.stringify(response.data.accessToken));

        localStorage.setItem("expiration", JSON.stringify(response.data.expiration));
        localStorage.setItem("role", "superuser");
     
      } else { 
        localStorage.setItem("user", JSON.stringify(response.data.accessToken));
        localStorage.setItem("expiration", JSON.stringify(response.data.expiration));
        localStorage.setItem("role", "user");}
     

      return response.data;
    });
};

const logout = () => {
  console.log("logged out");
  localStorage.removeItem("user");
  localStorage.removeItem("expiration");
  localStorage.removeItem("role");
  //history.push("/login");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
const getCurrentRole = () => {
  return localStorage.getItem("role");
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
  getExpiration,
  getCurrentRole
};

export default auth;