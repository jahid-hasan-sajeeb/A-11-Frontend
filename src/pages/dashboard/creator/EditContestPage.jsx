import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { fetchMyCreatedContests, updateContest } from "../../../api/creatorApi";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { getErrorMessage } from "../../../lib/axios";

export const EditContestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["my-created-contests"],
    queryFn: fetchMyCreatedContests,
  });

  const contest = contests.find((item) => item._id === id);

  const { register, control, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (contest) {
      setValue("name", contest.name);
      setValue("image", contest.image);
      setValue("description", contest.description);
      setValue("entryFee", contest.entryFee);
      setValue("prizeMoney", contest.prizeMoney);
      setValue("taskInstruction", contest.taskInstruction);
      setValue("type", contest.type);
      setValue("deadline", contest.deadline ? new Date(contest.deadline) : null);
    }
  }, [contest, setValue]);

  const mutation = useMutation({
    mutationFn: (values) =>
      updateContest({
        contestId: id,
        payload: {
          ...values,
          entryFee: Number(values.entryFee),
          prizeMoney: Number(values.prizeMoney),
        },
      }),
    onSuccess: () => {
      toast.success("Contest updated");
      queryClient.invalidateQueries({ queryKey: ["my-created-contests"] });
      navigate("/dashboard/my-created-contests");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Update failed")),
  });

  if (isLoading) return <LoadingSpinner />;
  if (!contest) return <p>Contest not found.</p>;

  return (
    <div>
      <h2 className="text-2xl font-black">Edit Contest</h2>

      <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-semibold">Name</label>
          <input className="input" {...register("name", { required: true })} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-semibold">Image URL</label>
          <input className="input" {...register("image", { required: true })} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-semibold">Description</label>
          <textarea className="input" rows={4} {...register("description", { required: true })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Entry Fee</label>
          <input className="input" type="number" step="0.01" {...register("entryFee", { required: true })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Prize Money</label>
          <input className="input" type="number" step="0.01" {...register("prizeMoney", { required: true })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Type</label>
          <input className="input" {...register("type", { required: true })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Deadline</label>
          <Controller
            control={control}
            name="deadline"
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                className="input"
                selected={field.value}
                onChange={field.onChange}
                showTimeSelect
                dateFormat="Pp"
              />
            )}
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-semibold">Task Instruction</label>
          <textarea className="input" rows={4} {...register("taskInstruction", { required: true })} />
        </div>

        <div className="md:col-span-2">
          <button className="btn btn-primary" type="submit" disabled={mutation.isPending}>
            Update Contest
          </button>
        </div>
      </form>
    </div>
  );
};
