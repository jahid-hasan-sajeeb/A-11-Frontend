import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <section className="section-space">
      <div className="container-pad">
        <div className="card mx-auto max-w-xl space-y-4 p-8 text-center">
          <p className="badge mx-auto">404</p>
          <h2 className="text-3xl font-black">Page Not Found</h2>
          <p className="text-[var(--text-soft)]">The page you are looking for does not exist.</p>
          <Link to="/" className="btn btn-primary inline-flex">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};
