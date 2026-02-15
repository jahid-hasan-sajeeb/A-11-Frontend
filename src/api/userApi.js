import { api } from "../lib/axios";

export const fetchMyParticipations = async () => {
  const res = await api.get("/users/me/participations");
  return res.data.data;
};

export const fetchMyWins = async () => {
  const res = await api.get("/users/me/wins");
  return res.data.data;
};

export const updateMyProfile = async (payload) => {
  const res = await api.patch("/users/me/profile", payload);
  return res.data;
};
