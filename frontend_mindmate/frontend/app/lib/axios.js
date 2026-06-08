import axios from "axios";

export const axiosinstance = axios.create({
  baseURL : "https://mindmate-1-gc94.onrender.com/mindmate",
  withCredentials : true
})