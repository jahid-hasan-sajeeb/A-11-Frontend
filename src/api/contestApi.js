import { api } from "../lib/axios";

export const fetchPopularContests = async () => {
  const res = await api.get("/contests/popular?limit=5");
  return res.data.data;
};

export const fetchAllContests = async ({ page = 1, type = "", search = "" }) => {
  const params = new URLSearchParams({
    status: "confirmed",
    page: String(page),
    limit: "12",
  });

  if (type) params.set("type", type);
  if (search) params.set("search", search);

  const res = await api.get(`/contests?${params.toString()}`);
  return res.data;
};

export const fetchContestDetails = async (id) => {
  const res = await api.get(`/contests/${id}`);
  return res.data.data;
};

export const registerContest = async ({ contestId, paymentIntentId }) => {
  const res = await api.post(`/contests/${contestId}/register`, { paymentIntentId });
  return res.data;
};

export const submitContestTask = async ({ contestId, submissionText }) => {
  const res = await api.post(`/contests/${contestId}/submissions`, { submissionText });
  return res.data;
};
