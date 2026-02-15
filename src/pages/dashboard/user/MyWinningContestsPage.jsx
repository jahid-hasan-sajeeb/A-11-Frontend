import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { fetchMyWins } from "../../../api/userApi";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";

export const MyWinningContestsPage = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["my-wins"],
    queryFn: fetchMyWins,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-black">My Winning Contests</h2>
      <p className="mt-1 text-sm text-[var(--text-soft)]">Your achievements and prize highlights.</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {data.map((contest) => (
          <article key={contest._id} className="card p-4">
            <img src={contest.image} alt={contest.name} className="h-36 w-full rounded-lg object-cover" />
            <h3 className="mt-3 font-bold">{contest.name}</h3>
            <p className="text-sm text-[var(--text-soft)]">{contest.type}</p>
            <p className="mt-2 font-semibold text-[var(--accent)]">Prize ${contest.prizeMoney}</p>
            <p className="text-xs text-[var(--text-soft)]">Declared {dayjs(contest.winnerDeclaredAt).format("DD MMM YYYY")}</p>
          </article>
        ))}
        {!data.length ? <p className="text-sm text-[var(--text-soft)]">No wins yet. Keep participating.</p> : null}
      </div>
    </div>
  );
};
