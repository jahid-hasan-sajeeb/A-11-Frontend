import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { fetchSubmissions, declareWinner } from "../../../api/creatorApi";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { getErrorMessage } from "../../../lib/axios";

export const SubmittedTasksPage = () => {
  const [searchParams] = useSearchParams();
  const contestId = searchParams.get("contestId") || "";
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["submitted-tasks", contestId],
    queryFn: () => fetchSubmissions(contestId),
  });

  const mutation = useMutation({
    mutationFn: ({ contestId: cId, submissionId }) => declareWinner({ contestId: cId, submissionId }),
    onSuccess: () => {
      toast.success("Winner declared successfully");
      queryClient.invalidateQueries({ queryKey: ["submitted-tasks", contestId] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to declare winner")),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-black">Submitted Tasks</h2>
      <p className="mt-1 text-sm text-[var(--text-soft)]">Review submissions and declare one winner per contest.</p>

      <div className="mt-5 grid gap-4">
        {data.map((submission) => (
          <article key={submission._id} className="card space-y-3 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold">{submission.contestId?.name}</h3>
                <p className="text-xs text-[var(--text-soft)]">
                  Submitted on {dayjs(submission.submittedAt).format("DD MMM YYYY hh:mm A")}
                </p>
              </div>
              <span className="badge">{submission.isWinner ? "Winner" : "Submission"}</span>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
              <p className="text-sm font-semibold">Participant: {submission.userId?.name}</p>
              <p className="text-xs text-[var(--text-soft)]">{submission.userId?.email}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm">{submission.submissionText}</p>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              disabled={submission.isWinner || mutation.isPending}
              onClick={async () => {
                const result = await Swal.fire({
                  title: "Declare this submission as winner?",
                  text: "Only one winner is allowed per contest.",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonText: "Declare Winner",
                });

                if (result.isConfirmed) {
                  mutation.mutate({ contestId: submission.contestId?._id, submissionId: submission._id });
                }
              }}
            >
              {submission.isWinner ? "Winner Declared" : "Declare Winner"}
            </button>
          </article>
        ))}

        {!data.length ? <p className="text-sm text-[var(--text-soft)]">No submissions found.</p> : null}
      </div>
    </div>
  );
};
