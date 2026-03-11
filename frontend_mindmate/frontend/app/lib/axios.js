import axios from "axios";

export const axiosinstance = axios.create({
  baseURL : "http://localhost:8005/mindmate",
  withCredentials : true
})