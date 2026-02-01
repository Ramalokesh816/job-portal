import axios from "axios";

const API = axios.create({
  baseURL: "https://jobportal-backend-2-uk4t.onrender.com"
});

export default API;
