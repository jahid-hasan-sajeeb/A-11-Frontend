import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { fetchContestDetails, submitContestTask } from "../../api/contestApi";
import { CountdownTimer } from "../../components/common/CountdownTimer";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { getErrorMessage } from "../../lib/axios";

export const ContestDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const { data: contest, isLoading } = useQuery({
    queryKey: ["contest-details", id],
    queryFn: () => fetchContestDetails(id),
  });

  const submitMutation = useMutation({
    mutationFn: (submissionText) => submitContestTask({ contestId: id, submissionText }),
    onSuccess: () => {
      toast.success("Task submitted successfully");
      setShowModal(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ["contest-details", id] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Submission failed")),
  });

  if (isLoading) {
    return <LoadingSpinner full />;
  }

  if (!contest) {
    return null;
  }

  const canSubmit = contest.hasRegistered && !contest.contestEnded;

  return (
    <section className="section-space">
      <div className="container-pad grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <article className="card overflow-hidden">
          <img src={contest.image} alt={contest.name} className="h-64 w-full object-cover md:h-80" />
          <div className="space-y-4 p-5 md:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-black md:text-3xl">{contest.name}</h2>
              <span className="badge">{contest.type}</span>
            </div>
            <p className="text-[var(--text-soft)]">{contest.description}</p>
            <div>
              <h3 className="font-bold">Task Instruction</h3>
              <p className="mt-1 text-sm text-[var(--text-soft)]">{contest.taskInstruction}</p>
            </div>
          </div>
        </article>

        <aside className="card space-y-4 p-5">
          <p>
            <span className="font-semibold">Participants:</span> {contest.participantsCount}
          </p>
          <p>
            <span className="font-semibold">Prize Money:</span> ${contest.prizeMoney}
          </p>
          <p>
            <span className="font-semibold">Entry Fee:</span> ${contest.entryFee}
          </p>
          <p>
            <span className="font-semibold">Deadline:</span> {dayjs(contest.deadline).format("DD MMM YYYY hh:mm A")}
          </p>
          <CountdownTimer deadline={contest.deadline} />

          {contest.winnerUserId ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
              <p className="text-xs text-[var(--text-soft)]">Winner</p>
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={contest.winnerUserId.photoURL}
                  alt={contest.winnerUserId.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="font-semibold">{contest.winnerUserId.name}</span>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            className="btn btn-primary w-full"
            disabled={contest.contestEnded || contest.hasRegistered}
            onClick={() => navigate(`/payment/contest/${id}`)}
          >
            {contest.hasRegistered ? "Already Registered" : "Register / Pay"}
          </button>

          <button
            type="button"
            className="btn btn-secondary w-full"
            disabled={!canSubmit || contest.hasSubmitted}
            onClick={() => setShowModal(true)}
          >
            {contest.hasSubmitted ? "Task Already Submitted" : "Submit Task"}
          </button>
        </aside>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="card w-full max-w-lg space-y-4 p-5">
            <h3 className="text-xl font-bold">Submit your task</h3>
            <form
              className="space-y-3"
              onSubmit={handleSubmit((values) => submitMutation.mutate(values.submissionText))}
            >
              <textarea
                rows={6}
                className="input"
                placeholder="Share your submission links, resources, and notes"
                {...register("submissionText", {
                  required: "Submission is required",
                  minLength: { value: 10, message: "Minimum 10 characters" },
                })}
              />
              {errors.submissionText ? (
                <p className="text-xs text-[var(--danger)]">{errors.submissionText.message}</p>
              ) : null}
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting || submitMutation.isPending}>
                  Submit Task
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
};
