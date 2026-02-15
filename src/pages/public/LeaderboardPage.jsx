import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard } from "../../api/siteApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { SectionTitle } from "../../components/common/SectionTitle";

export const LeaderboardPage = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
  });

  return (
    <section className="section-space">
      <div className="container-pad">
        <SectionTitle
          eyebrow="Challenge Task"
          title="Leaderboard"
          description="Users ranked by number of contest wins."
        />

        {isLoading ? <LoadingSpinner /> : null}

        <div className="card overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--surface-2)]">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Wins</th>
                <th className="px-4 py-3">Participated</th>
                <th className="px-4 py-3">Win %</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user._id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 font-bold">#{user.rank}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={user.photoURL} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-[var(--primary)]">{user.stats?.winCount || 0}</td>
                  <td className="px-4 py-3">{user.stats?.participatedCount || 0}</td>
                  <td className="px-4 py-3">{user.stats?.winPercentage || 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
