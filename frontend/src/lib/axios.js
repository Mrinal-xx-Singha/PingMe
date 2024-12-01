// instance we can use through out

import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ?"http://localhost:5001/api" : "/api",
  // send cookies with every single request

  withCredentials: true,
});
