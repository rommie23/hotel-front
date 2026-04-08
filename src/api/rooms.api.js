import api from "./axios";

export const getAvailableRooms = async (from, to) => {
  const res = await api.post("/rooms/available", {
    from,
    to,
  });
  return res.data;
};

export const getRoomTypes = async () => {
  const res = await api.get("/rooms/room-types");  
  return res.data.data;
};

export const getBookingSources = async () => {
  const res = await api.get("/reservations/booking-sources");
  return res.data.data;
};

export const getPaymentMethods = async () => {
  const res = await api.get("/payments/payment-modes");
  return res.data.data;
};
