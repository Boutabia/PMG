import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3001/api/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "content/allscenarios", { headers: authHeader() });
};

export default {
  getPublicContent,
  getUserBoard,
};