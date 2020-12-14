import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3001/api/";

const getScenarios = () => {
  return axios.get(API_URL + "content/allScenarios", { headers: authHeader() });
};

const getCategories = () => {
  return axios.get(API_URL + "content/category");
};

export default {
  getScenarios,
  getCategories,
};