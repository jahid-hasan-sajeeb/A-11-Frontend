import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updateMyProfile } from "../../../api/userApi";
import { useAuth } from "../../../hooks/useAuth";
import { getErrorMessage } from "../../../lib/axios";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const MyProfilePage = () => {
  const { user, refreshSession } = useAuth();

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
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
  const currentPhoto = watch("photoURL");

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black">My Profile</h2>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form className="space-y-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <div>
            <label htmlFor="profile-name" className="mb-1 block text-sm font-semibold">
              Name
            </label>
            <input
              id="profile-name"
              className="input"
              {...register("name", { required: "Name is required", minLength: { value: 2, message: "Minimum 2 characters" } })}
            />
            {errors.name ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.name.message}</p> : null}
          </div>

          <div>
            <label htmlFor="profile-photo-upload" className="mb-1 block text-sm font-semibold">
              Profile Image Upload
            </label>
            <input
              id="profile-photo-upload"
              className="input"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const dataUrl = await fileToDataUrl(file);
                  setValue("photoURL", dataUrl, { shouldDirty: true });
                  toast.success("Image selected");
                } catch (_error) {
                  toast.error("Failed to read image");
                }
              }}
            />
          </div>

          <div>
            <label htmlFor="profile-photo-url" className="mb-1 block text-sm font-semibold">
              Photo URL
            </label>
            <input id="profile-photo-url" className="input" {...register("photoURL", { required: "Photo URL is required" })} />
            {errors.photoURL ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.photoURL.message}</p> : null}
          </div>

          <div>
            <label htmlFor="profile-bio" className="mb-1 block text-sm font-semibold">
              Bio
            </label>
            <textarea id="profile-bio" rows={4} className="input" {...register("bio")} />
          </div>

          <div>
            <label htmlFor="profile-address" className="mb-1 block text-sm font-semibold">
              Address
            </label>
            <input id="profile-address" className="input" {...register("address")} />
          </div>

          <button className="btn btn-primary" type="submit" disabled={isSubmitting || mutation.isPending}>
            Update Profile
          </button>
        </form>

        <div className="card p-4">
          <h3 className="font-bold">Win Percentage</h3>
          {currentPhoto ? (
            <img src={currentPhoto} alt={user?.name} className="mt-3 h-20 w-20 rounded-full object-cover" />
          ) : null}
          <p className="mt-2 text-sm text-[var(--text-soft)]">{winPercentage}%</p>
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
