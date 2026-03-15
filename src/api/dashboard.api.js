import axios from "./axios";

// 🔵 Get Today's Arrivals
export const getTodayArrivals = async () => {
  const response = await axios.get("/dashboard/today-arrivals");  
  return response.data;
};

// 🟡 Get Today's Checkouts
export const getTodayCheckouts = async () => {
  const response = await axios.get("/dashboard/today-checkouts");
  return response.data;
  
};