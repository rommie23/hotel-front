import api from "./axios";

export const allReservations = async () => {
  const response = await api.get("/reservations/reservation-list");  
  return response.data.data;
};