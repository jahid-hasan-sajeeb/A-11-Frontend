import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchUsers, updateUserRole } from "../../../api/adminApi";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { Pagination } from "../../../components/common/Pagination";
import { getErrorMessage } from "../../../lib/axios";

export const ManageUsersPage = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page],
    queryFn: () => fetchUsers(page, 10),
  });

  const mutation = useMutation({
    mutationFn: ({ userId, role }) => updateUserRole({ userId, role }),
    onSuccess: () => {
      toast.success("Role updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to update role")),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-black">Manage Users</h2>
      <p className="mt-1 text-sm text-[var(--text-soft)]">Paginated table with role control.</p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((user) => (
              <tr key={user._id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="badge">{user.role}</span>
                </td>
                <td className="px-4 py-3">
                  <select
                    className="input max-w-36"
                    defaultValue={user.role}
                    onChange={(e) => mutation.mutate({ userId: user._id, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="creator">Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={data?.meta?.page || 1} totalPages={data?.meta?.totalPages || 1} onPageChange={setPage} />
    </div>
  );
};
