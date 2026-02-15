import { useAuth } from "../../hooks/useAuth";

export const DashboardHomePage = () => {
  const { user, role } = useAuth();

  return (
    <div>
      <h2 className="text-3xl font-black">Welcome, {user?.name}</h2>
      <p className="mt-2 text-[var(--text-soft)]">
        Role: <span className="font-semibold text-[var(--primary)]">{role}</span>
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <article className="card p-4">
          <p className="text-xs text-[var(--text-soft)]">Participated</p>
          <p className="mt-2 text-2xl font-black">{user?.stats?.participatedCount || 0}</p>
        </article>
        <article className="card p-4">
          <p className="text-xs text-[var(--text-soft)]">Wins</p>
          <p className="mt-2 text-2xl font-black">{user?.stats?.winCount || 0}</p>
        </article>
        <article className="card p-4">
          <p className="text-xs text-[var(--text-soft)]">Win %</p>
          <p className="mt-2 text-2xl font-black">{user?.stats?.winPercentage || 0}%</p>
        </article>
      </div>
    </div>
  );
};
