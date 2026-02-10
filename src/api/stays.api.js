import api from "./axios";

export const checkInGuest = async (payload) => {
  const res = await api.post("/stays/checkin", payload);
  return res.data;
};

export const getActiveStays = async () => {
  const res = await api.get("/stays/active");
  return res.data;
};

export const getRoomBoard = async () => {
  const res = await api.get("/stays/room-board");
  return res.data;
};

export const checkoutStay = async (stayId) => {
  const res = await api.post(`/stays/${stayId}/checkout`);
  return res.data;
};
export const changeRoom = async (stayId, targetRoomId) => {
  const res = await api.post(`/stays/${stayId}/change-room`,{newRoomId : targetRoomId});
  return res.data;
};
