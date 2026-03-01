import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { fetchAllContests, fetchContestDetails, submitContestTask } from "../../api/contestApi";
import { CountdownTimer } from "../../components/common/CountdownTimer";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../lib/axios";

export const ContestDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
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

  const { data: relatedData } = useQuery({
    queryKey: ["related-contests", contest?.type],
    enabled: Boolean(contest?.type),
    queryFn: () => fetchAllContests({ page: 1, type: contest.type, sort: "popular" }),
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
  const related = (relatedData?.data || []).filter((item) => item._id !== contest._id).slice(0, 4);
  const galleryImages = [contest.image, ...related.map((item) => item.image)].filter(Boolean).slice(0, 4);

  return (
    <section className="section-space">
      <div className="container-pad grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <article className="card overflow-hidden">
          <div className="grid gap-2 p-2 sm:grid-cols-2">
            {galleryImages.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`${contest.name}-${index + 1}`}
                className={`w-full rounded-xl object-cover ${index === 0 ? "h-64 sm:col-span-2 md:h-80" : "h-36 md:h-44"}`}
                loading="lazy"
              />
            ))}
          </div>
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
            <div className="grid gap-3 sm:grid-cols-3">
              <article className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm">
                <p className="text-xs text-[var(--text-soft)]">Contest Type</p>
                <p className="mt-1 font-semibold">{contest.type}</p>
              </article>
              <article className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm">
                <p className="text-xs text-[var(--text-soft)]">Creator</p>
                <p className="mt-1 font-semibold">{contest.creatorId?.name || "Unknown"}</p>
              </article>
              <article className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm">
                <p className="text-xs text-[var(--text-soft)]">Status</p>
                <p className="mt-1 font-semibold">{contest.status}</p>
              </article>
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
            onClick={() => {
              if (!user) {
                navigate("/login", { state: { from: `/contest/${id}` } });
                return;
              }
              navigate(`/payment/contest/${id}`);
            }}
          >
            {contest.hasRegistered ? "Already Registered" : "Register / Pay"}
          </button>

          <button
            type="button"
            className="btn btn-secondary w-full"
            disabled={!canSubmit || contest.hasSubmitted}
            onClick={() => {
              if (!user) {
                navigate("/login", { state: { from: `/contest/${id}` } });
                return;
              }
              setShowModal(true);
            }}
          >
            {contest.hasSubmitted ? "Task Already Submitted" : "Submit Task"}
          </button>
        </aside>
      </div>

      {related.length ? (
        <div className="container-pad mt-8">
          <h3 className="mb-3 text-xl font-black">Related Contests</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <article key={item._id} className="card overflow-hidden">
                <img src={item.image} alt={item.name} className="h-36 w-full object-cover" loading="lazy" />
                <div className="space-y-2 p-3">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-xs text-[var(--text-soft)]">{item.type}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

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
