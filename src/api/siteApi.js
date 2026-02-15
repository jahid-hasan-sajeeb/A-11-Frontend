import { api } from "../lib/axios";

export const fetchLeaderboard = async () => {
  const res = await api.get("/leaderboard");
  return res.data.data;
};

export const fetchRecentWinners = async () => {
  const res = await api.get("/winners/recent");
  return res.data.data;
};

export const fetchSuccessStories = async () => {
  const res = await api.get("/site/success-stories");
  return res.data.data;
};

export const fetchHelpCenter = async () => {
  const res = await api.get("/site/help-center");
  return res.data.data;
};
