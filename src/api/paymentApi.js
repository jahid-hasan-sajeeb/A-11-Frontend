import { api } from "../lib/axios";

export const createContestPaymentIntent = async (contestId) => {
  const res = await api.post("/payments/contest/create-intent", { contestId });
  return res.data.data;
};
