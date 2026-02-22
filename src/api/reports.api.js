import api from "./axios";

// Admin / Manager - Daily summary
export const getDailySummary = async () => {
  const res = await api.get("/reports/daily-summary");
  return res.data;
};

// Revenue report (date range)
export const getRevenueReport = async (from, to) => {
  const res = await api.post("/reports/revenue", {
    from,
    to,
  });
  return res.data;
};

// Occupancy report
export const getOccupancyReport = async () => {
  const res = await api.get("/reports/occupancy");
  return res.data;
};

export const getCompleteOccupancyReport = async (from, to) => {
  const res = await api.get("/reports/complete-occupancy",{params:{from,to}});
  return res.data;
};
