import { api } from "../lib/axios";

export const fetchAdminOverview = async () => {
  const res = await api.get("/admin/overview");
  return res.data.data;
};

export const fetchUsers = async (page = 1, limit = 10) => {
  const res = await api.get(`/admin/users?page=${page}&limit=${limit}`);
  return res.data;
};

export const updateUserRole = async ({ userId, role }) => {
  const res = await api.patch(`/admin/users/${userId}/role`, { role });
  return res.data;
};

export const fetchAdminContests = async (page = 1, limit = 12) => {
  const res = await api.get(`/admin/contests?page=${page}&limit=${limit}`);
  return res.data;
};

export const moderateContest = async ({ contestId, status }) => {
  const res = await api.patch(`/admin/contests/${contestId}/status`, { status });
  return res.data;
};

export const deleteAdminContest = async (contestId) => {
  const res = await api.delete(`/admin/contests/${contestId}`);
  return res.data;
};
