import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://pmg-tuni.herokuapp.com/api/";

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const user = {
  getUserBoard
}

export default user;