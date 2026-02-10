import api from "./axios";

export const getAvailableRooms = async (from, to) => {
  const res = await api.post("/rooms/available", {
    from,
    to,
  });
  return res.data;
};

