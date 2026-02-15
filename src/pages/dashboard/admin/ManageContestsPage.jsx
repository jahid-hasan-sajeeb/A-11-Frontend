import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { fetchAdminContests, moderateContest, deleteAdminContest } from "../../../api/adminApi";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { Pagination } from "../../../components/common/Pagination";
import { getErrorMessage } from "../../../lib/axios";

export const ManageContestsPage = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-contests", page],
    queryFn: () => fetchAdminContests(page, 12),
  });

  const moderateMutation = useMutation({
    mutationFn: ({ contestId, status }) => moderateContest({ contestId, status }),
    onSuccess: () => {
      toast.success("Contest status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-contests"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to update status")),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminContest,
    onSuccess: () => {
      toast.success("Contest deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-contests"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Delete failed")),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-black">Manage Contests</h2>
      <p className="mt-1 text-sm text-[var(--text-soft)]">Confirm, reject, or delete submitted contests.</p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Creator</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((contest) => (
              <tr key={contest._id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">{contest.name}</td>
                <td className="px-4 py-3">{contest.type}</td>
                <td className="px-4 py-3">{contest.creatorId?.email || "Unknown"}</td>
                <td className="px-4 py-3">
                  <span className="badge">{contest.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-primary text-xs"
                      onClick={() => moderateMutation.mutate({ contestId: contest._id, status: "confirmed" })}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary text-xs"
                      onClick={() => moderateMutation.mutate({ contestId: contest._id, status: "rejected" })}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="btn bg-[var(--danger)] text-xs text-white"
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: "Delete this contest?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Delete",
                        });

                        if (result.isConfirmed) {
                          deleteMutation.mutate(contest._id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!data?.data?.length ? (
              <tr>
                <td className="px-4 py-4 text-[var(--text-soft)]" colSpan={5}>
                  No contests found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <Pagination page={data?.meta?.page || 1} totalPages={data?.meta?.totalPages || 1} onPageChange={setPage} />
    </div>
  );
};
