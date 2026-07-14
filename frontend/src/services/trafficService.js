import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});


export const getTrafficData = (
  page,
  limit,
  search = "",
  congestion = ""
) => {
  return API.get("/traffic", {
    params: {
      page,
      limit,
      search,
      congestion,
    },
  });
};