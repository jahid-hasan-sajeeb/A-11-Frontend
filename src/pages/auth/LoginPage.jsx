import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../lib/axios";

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const { signIn, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/";

  const onSubmit = async (values) => {
    try {
      await signIn(values);
      toast.success("Login successful");
      navigate(redirectPath, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to login"));
    }
  };

  return (
    <section className="section-space">
      <div className="container-pad">
        <div className="card mx-auto max-w-lg space-y-5 p-6 md:p-8">
          <h2 className="text-3xl font-black">Login</h2>
          <p className="text-sm text-[var(--text-soft)]">Email/password login with JWT session.</p>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="login-email" className="mb-1 block text-sm font-semibold">
                Email
              </label>
              <input
                id="login-email"
                className="input"
                type="email"
                placeholder="you@example.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.email.message}</p> : null}
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1 block text-sm font-semibold">
                Password
              </label>
              <input
                id="login-password"
                className="input"
                type="password"
                placeholder="********"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.password.message}</p> : null}
            </div>

            <button className="btn btn-primary w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setValue("email", "user@contestforge.dev");
                setValue("password", "User1234");
              }}
            >
              Fill Demo User
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setValue("email", "admin@contestforge.dev");
                setValue("password", "Admin1234");
              }}
            >
              Fill Demo Admin
            </button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              className="btn btn-accent"
              onClick={async () => {
                try {
                  await demoLogin("user");
                  toast.success("Logged in as demo user");
                  navigate(redirectPath, { replace: true });
                } catch (error) {
                  toast.error(getErrorMessage(error, "Demo login failed"));
                }
              }}
            >
              Demo Login User
            </button>
            <button
              type="button"
              className="btn btn-accent"
              onClick={async () => {
                try {
                  await demoLogin("admin");
                  toast.success("Logged in as demo admin");
                  navigate(redirectPath, { replace: true });
                } catch (error) {
                  toast.error(getErrorMessage(error, "Demo login failed"));
                }
              }}
            >
              Demo Login Admin
            </button>
          </div>

          <p className="text-sm text-[var(--text-soft)]">
            New user?{" "}
            <Link className="font-semibold text-[var(--primary)]" to="/register">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
