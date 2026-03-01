import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updateMyPassword } from "../../../api/userApi";
import { getErrorMessage } from "../../../lib/axios";

export const MySettingsPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const newPasswordValue = watch("newPassword", "");

  const mutation = useMutation({
    mutationFn: updateMyPassword,
    onSuccess: () => {
      toast.success("Password updated successfully");
      reset();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to update password")),
  });

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black">Settings</h2>
      <p className="text-sm text-[var(--text-soft)]">Update your account password.</p>

      <form className="card max-w-xl space-y-4 p-5" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <div>
          <label htmlFor="settings-current-password" className="mb-1 block text-sm font-semibold">
            Current Password
          </label>
          <input
            id="settings-current-password"
            type="password"
            className="input"
            {...register("currentPassword", { required: "Current password is required" })}
          />
          {errors.currentPassword ? (
            <p className="mt-1 text-xs text-[var(--danger)]">{errors.currentPassword.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="settings-new-password" className="mb-1 block text-sm font-semibold">
            New Password
          </label>
          <input
            id="settings-new-password"
            type="password"
            className="input"
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 8, message: "Minimum 8 characters" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message: "Use uppercase, lowercase, and a number",
              },
            })}
          />
          {errors.newPassword ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.newPassword.message}</p> : null}
        </div>

        <div>
          <label htmlFor="settings-confirm-password" className="mb-1 block text-sm font-semibold">
            Confirm New Password
          </label>
          <input
            id="settings-confirm-password"
            type="password"
            className="input"
            {...register("confirmPassword", {
              required: "Please confirm your new password",
              validate: (value) => value === newPasswordValue || "Passwords do not match",
            })}
          />
          {errors.confirmPassword ? (
            <p className="mt-1 text-xs text-[var(--danger)]">{errors.confirmPassword.message}</p>
          ) : null}
        </div>

        <button className="btn btn-primary" type="submit" disabled={isSubmitting || mutation.isPending}>
          {isSubmitting || mutation.isPending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};
