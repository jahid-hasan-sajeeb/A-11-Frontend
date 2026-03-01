import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../lib/axios";

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const passwordValue = watch("password", "");

  const onSubmit = async (values) => {
    try {
      await signUp(values);
      toast.success("Registration successful");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to register"));
    }
  };

  return (
    <section className="section-space">
      <div className="container-pad">
        <div className="card mx-auto max-w-lg space-y-5 p-6 md:p-8">
          <h2 className="text-3xl font-black">Create Account</h2>
          <p className="text-sm text-[var(--text-soft)]">Register with secure password and JWT auth.</p>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="register-name" className="mb-1 block text-sm font-semibold">
                Name
              </label>
              <input
                id="register-name"
                className="input"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                })}
              />
              {errors.name ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.name.message}</p> : null}
            </div>

            <div>
              <label htmlFor="register-email" className="mb-1 block text-sm font-semibold">
                Email
              </label>
              <input
                id="register-email"
                className="input"
                type="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.email.message}</p> : null}
            </div>

            <div>
              <label htmlFor="register-password" className="mb-1 block text-sm font-semibold">
                Password
              </label>
              <input
                id="register-password"
                className="input"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    message: "Use uppercase, lowercase, and a number",
                  },
                })}
              />
              {errors.password ? (
                <p className="mt-1 text-xs text-[var(--danger)]">{errors.password.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="register-confirm-password" className="mb-1 block text-sm font-semibold">
                Confirm Password
              </label>
              <input
                id="register-confirm-password"
                className="input"
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === passwordValue || "Passwords do not match",
                })}
              />
              {errors.confirmPassword ? (
                <p className="mt-1 text-xs text-[var(--danger)]">{errors.confirmPassword.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="register-photo-url" className="mb-1 block text-sm font-semibold">
                Photo URL (Optional)
              </label>
              <input id="register-photo-url" className="input" type="url" placeholder="https://" {...register("photoURL")} />
            </div>

            <button className="btn btn-primary w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-[var(--text-soft)]">
            Already have an account?{" "}
            <Link className="font-semibold text-[var(--primary)]" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
