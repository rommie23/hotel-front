import api from "./axios";

export const startCleaning = (logId) =>
  api.post(`/housekeeping/${logId}/start`);
