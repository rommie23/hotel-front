import api from "./axios";

// Admin / Manager - Daily summary
export const getDailySummary = async () => {
  const res = await api.get("/reports/daily-summary");
  return res.data;
};

// Revenue report (date range)
export const getRevenueReport = async (fromDate, toDate) => {
  const res = await api.post("/reports/revenue", {
    fromDate,
    toDate,
  });
  return res.data;
};

// Occupancy report
export const getOccupancyReport = async () => {
  const res = await api.get("/reports/occupancy");
  return res.data;
};
