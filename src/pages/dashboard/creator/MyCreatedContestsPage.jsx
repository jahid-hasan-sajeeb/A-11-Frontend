import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { fetchMyCreatedContests, deleteContest } from "../../../api/creatorApi";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { getErrorMessage } from "../../../lib/axios";

export const MyCreatedContestsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["my-created-contests"],
    queryFn: fetchMyCreatedContests,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContest,
    onSuccess: () => {
      toast.success("Contest deleted");
      queryClient.invalidateQueries({ queryKey: ["my-created-contests"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Delete failed")),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-black">My Created Contests</h2>
      <p className="mt-1 text-sm text-[var(--text-soft)]">Pending contests can be edited or deleted.</p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((contest) => {
              const pending = contest.status === "pending";
              return (
                <tr key={contest._id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3">{contest.name}</td>
                  <td className="px-4 py-3">{contest.type}</td>
                  <td className="px-4 py-3">
                    <span className="badge">{contest.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {pending ? (
                        <Link className="btn btn-secondary text-xs" to={`/dashboard/edit-contest/${contest._id}`}>
                          Edit
                        </Link>
                      ) : null}
                      {pending ? (
                        <button
                          type="button"
                          className="btn bg-[var(--danger)] text-xs text-white"
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: "Delete contest?",
                              text: "This action cannot be undone.",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Yes, delete",
                            });
                            if (result.isConfirmed) {
                              deleteMutation.mutate(contest._id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="btn btn-primary text-xs"
                        onClick={() => navigate(`/dashboard/submitted-tasks?contestId=${contest._id}`)}
                      >
                        See Submissions
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
