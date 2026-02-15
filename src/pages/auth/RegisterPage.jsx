import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../lib/axios";

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { signUp } = useAuth();
  const navigate = useNavigate();

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
          <p className="text-sm text-[var(--text-soft)]">Name, email, password and photo URL.</p>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-1 block text-sm font-semibold">Name</label>
              <input className="input" {...register("name", { required: "Name is required" })} />
              {errors.name ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.name.message}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">Email</label>
              <input className="input" type="email" {...register("email", { required: "Email is required" })} />
              {errors.email ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.email.message}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">Password</label>
              <input
                className="input"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              {errors.password ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.password.message}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">Photo URL</label>
              <input
                className="input"
                type="url"
                placeholder="https://"
                {...register("photoURL", { required: "Photo URL is required" })}
              />
              {errors.photoURL ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.photoURL.message}</p> : null}
            </div>

            <button className="btn btn-primary w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-[var(--text-soft)]">
            Already have an account? <Link className="font-semibold text-[var(--primary)]" to="/login">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
};
