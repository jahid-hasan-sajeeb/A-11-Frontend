import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchAdminOverview } from "../../api/adminApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

const COLORS = ["#0ea5e9", "#22c55e", "#f97316", "#f43f5e", "#8b5cf6", "#14b8a6"];

export const DashboardHomePage = () => {
  const { user, role } = useAuth();

  const { data: overview, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: fetchAdminOverview,
    enabled: role === "admin",
  });

  if (role === "admin" && isLoading) {
    return <LoadingSpinner />;
  }

  if (role === "admin") {
    const cards = overview?.cards || {};
    const monthly = overview?.monthlyParticipations || [];
    const statusBreakdown = overview?.statusBreakdown || [];
    const roleBreakdown = overview?.roleBreakdown || [];

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-black">Admin Overview</h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <article className="card p-4">
            <p className="text-xs text-[var(--text-soft)]">Total Users</p>
            <p className="mt-2 text-2xl font-black">{cards.totalUsers || 0}</p>
          </article>
          <article className="card p-4">
            <p className="text-xs text-[var(--text-soft)]">Total Contests</p>
            <p className="mt-2 text-2xl font-black">{cards.totalContests || 0}</p>
          </article>
          <article className="card p-4">
            <p className="text-xs text-[var(--text-soft)]">Pending</p>
            <p className="mt-2 text-2xl font-black">{cards.pendingContests || 0}</p>
          </article>
          <article className="card p-4">
            <p className="text-xs text-[var(--text-soft)]">Confirmed</p>
            <p className="mt-2 text-2xl font-black">{cards.confirmedContests || 0}</p>
          </article>
          <article className="card p-4">
            <p className="text-xs text-[var(--text-soft)]">Revenue</p>
            <p className="mt-2 text-2xl font-black">${cards.totalRevenue || 0}</p>
          </article>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <article className="card h-[320px] p-4">
            <h3 className="mb-3 font-bold">Monthly Participations (Bar)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#0ea5e9" name="Participations" />
              </BarChart>
            </ResponsiveContainer>
          </article>

          <article className="card h-[320px] p-4">
            <h3 className="mb-3 font-bold">Monthly Participations (Line)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} name="Participations" />
              </LineChart>
            </ResponsiveContainer>
          </article>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <article className="card h-[320px] p-4">
            <h3 className="mb-3 font-bold">Contests by Status</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                  {statusBreakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </article>

          <article className="card h-[320px] p-4">
            <h3 className="mb-3 font-bold">Users by Role</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                  {roleBreakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </article>
        </div>
      </div>
    );
  }

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
