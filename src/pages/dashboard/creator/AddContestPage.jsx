import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { createContest } from "../../../api/creatorApi";
import { getErrorMessage } from "../../../lib/axios";

const contestTypes = [
  "Image Design",
  "Article Writing",
  "Business Idea",
  "Gaming Review",
  "UI Challenge",
  "Marketing Pitch",
  "Video Editing",
];

export const AddContestPage = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      image: "",
      description: "",
      entryFee: "",
      prizeMoney: "",
      taskInstruction: "",
      type: contestTypes[0],
      deadline: null,
    },
  });

  const mutation = useMutation({
    mutationFn: (values) =>
      createContest({
        ...values,
        entryFee: Number(values.entryFee),
        prizeMoney: Number(values.prizeMoney),
      }),
    onSuccess: () => {
      toast.success("Contest created successfully");
      reset();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to create contest")),
  });

  return (
    <div>
      <h2 className="text-2xl font-black">Add Contest</h2>
      <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <div className="md:col-span-2">
          <label htmlFor="add-name" className="mb-1 block text-sm font-semibold">Name</label>
          <input id="add-name" className="input" {...register("name", { required: "Contest name is required" })} />
          {errors.name ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.name.message}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="add-image" className="mb-1 block text-sm font-semibold">Image URL</label>
          <input id="add-image" className="input" type="url" {...register("image", { required: "Image URL is required" })} />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="add-description" className="mb-1 block text-sm font-semibold">Description</label>
          <textarea id="add-description" className="input" rows={4} {...register("description", { required: true })} />
        </div>

        <div>
          <label htmlFor="add-entry-fee" className="mb-1 block text-sm font-semibold">Entry Fee</label>
          <input id="add-entry-fee" className="input" type="number" step="0.01" {...register("entryFee", { required: true, min: 0 })} />
        </div>

        <div>
          <label htmlFor="add-prize-money" className="mb-1 block text-sm font-semibold">Prize Money</label>
          <input id="add-prize-money" className="input" type="number" step="0.01" {...register("prizeMoney", { required: true, min: 1 })} />
        </div>

        <div>
          <label htmlFor="add-type" className="mb-1 block text-sm font-semibold">Contest Type</label>
          <select id="add-type" className="input" {...register("type", { required: true })}>
            {contestTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="add-deadline" className="mb-1 block text-sm font-semibold">Deadline</label>
          <Controller
            control={control}
            name="deadline"
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                id="add-deadline"
                className="input"
                selected={field.value}
                onChange={field.onChange}
                showTimeSelect
                dateFormat="Pp"
                minDate={new Date()}
              />
            )}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="add-task-instruction" className="mb-1 block text-sm font-semibold">Task Instruction</label>
          <textarea id="add-task-instruction" className="input" rows={4} {...register("taskInstruction", { required: true })} />
        </div>

        <div className="md:col-span-2">
          <button className="btn btn-primary" type="submit" disabled={isSubmitting || mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create Contest"}
          </button>
        </div>
      </form>
    </div>
  );
};
