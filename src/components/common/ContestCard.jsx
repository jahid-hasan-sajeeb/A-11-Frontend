import { Link } from "react-router-dom";
export const ContestCard = ({ contest }) => {
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <img
        src={contest.image}
        alt={contest.name}
        className="h-44 w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085";
        }}
      />
      <div className="flex flex-1 flex-col space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-bold">{contest.name}</h3>
          <span className="badge">{contest.type}</span>
        </div>
        <p className="line-clamp-3 text-sm text-[var(--text-soft)]">{contest.description?.slice(0, 120)}...</p>
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="font-semibold text-[var(--primary)]">Participants: {contest.participantsCount ?? 0}</span>
          <span className="font-semibold text-[var(--accent)]">Prize: ${contest.prizeMoney}</span>
        </div>
        <Link to={`/contest/${contest._id}`} className="btn btn-primary mt-auto inline-flex w-full items-center justify-center">
          Details
        </Link>
      </div>
    </article>
  );
};
