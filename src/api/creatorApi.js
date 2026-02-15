import { api } from "../lib/axios";

export const createContest = async (payload) => {
  const res = await api.post("/creator/contests", payload);
  return res.data;
};

export const fetchMyCreatedContests = async () => {
  const res = await api.get("/creator/contests");
  return res.data.data;
};

export const updateContest = async ({ contestId, payload }) => {
  const res = await api.patch(`/creator/contests/${contestId}`, payload);
  return res.data;
};

export const deleteContest = async (contestId) => {
  const res = await api.delete(`/creator/contests/${contestId}`);
  return res.data;
};

export const fetchSubmissions = async (contestId = "") => {
  const query = contestId ? `?contestId=${contestId}` : "";
  const res = await api.get(`/creator/submissions${query}`);
  return res.data.data;
};

export const declareWinner = async ({ contestId, submissionId }) => {
  const res = await api.patch(`/creator/contests/${contestId}/declare-winner`, { submissionId });
  return res.data;
};
