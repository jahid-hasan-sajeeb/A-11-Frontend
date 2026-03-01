import { useQuery } from "@tanstack/react-query";
import { fetchAdminOverview } from "../../../api/adminApi";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";

export const AdminReportsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: fetchAdminOverview,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black">Reports</h2>
      <p className="text-sm text-[var(--text-soft)]">Monthly participation and platform summary report.</p>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)]">
            <tr>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3">Participations</th>
            </tr>
          </thead>
          <tbody>
            {(data?.monthlyParticipations || []).map((item) => (
              <tr key={item.label} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">{item.label}</td>
                <td className="px-4 py-3">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
