import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updateMyProfile } from "../../../api/userApi";
import { useAuth } from "../../../hooks/useAuth";
import { getErrorMessage } from "../../../lib/axios";

export const MyProfilePage = () => {
  const { user, refreshSession } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      photoURL: user?.photoURL || "",
      bio: user?.bio || "",
      address: user?.address || "",
    },
  });

  const mutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: async () => {
      await refreshSession();
      toast.success("Profile updated successfully");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to update profile")),
  });

  const participated = user?.stats?.participatedCount || 0;
  const wins = user?.stats?.winCount || 0;

  const winPercentage = participated ? Math.round((wins / participated) * 100) : 0;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black">My Profile</h2>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form className="space-y-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <div>
            <label className="mb-1 block text-sm font-semibold">Name</label>
            <input className="input" {...register("name", { required: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Photo URL</label>
            <input className="input" {...register("photoURL", { required: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Bio</label>
            <textarea rows={4} className="input" {...register("bio")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Address</label>
            <input className="input" {...register("address")} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting || mutation.isPending}>
            Update Profile
          </button>
        </form>

        <div className="card p-4">
          <h3 className="font-bold">Win Percentage</h3>
          <p className="text-sm text-[var(--text-soft)]">{winPercentage}%</p>
          <div className="mt-4 flex items-center gap-4">
            <div
              className="h-28 w-28 rounded-full"
              style={{
                background: `conic-gradient(var(--primary) 0% ${winPercentage}%, var(--surface-2) ${winPercentage}% 100%)`,
              }}
            />
            <div className="space-y-1 text-sm text-[var(--text-soft)]">
              <p>Wins: {wins}</p>
              <p>Participated: {participated}</p>
              <p>Loss/Other: {Math.max(0, participated - wins)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
