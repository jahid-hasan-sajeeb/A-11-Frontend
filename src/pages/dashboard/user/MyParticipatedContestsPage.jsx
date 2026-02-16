import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { fetchMyParticipations } from "../../../api/userApi";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";

export const MyParticipatedContestsPage = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["my-participations"],
    queryFn: fetchMyParticipations,
  });

  const sorted = [...data].sort((a, b) => new Date(a.contest?.deadline) - new Date(b.contest?.deadline));

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-black">My Participated Contests</h2>
      <p className="mt-1 text-sm text-[var(--text-soft)]">Sorted by upcoming deadline.</p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)]">
            <tr>
              <th className="px-4 py-3">Contest</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr key={item._id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">{item.contest?.name || "Deleted Contest"}</td>
                <td className="px-4 py-3">{item.contest?.deadline ? dayjs(item.contest.deadline).format("DD MMM YYYY") : "-"}</td>
                <td className="px-4 py-3">
                  <span className="badge">{item.paymentStatus}</span>
                </td>
                <td className="px-4 py-3">${item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
