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
