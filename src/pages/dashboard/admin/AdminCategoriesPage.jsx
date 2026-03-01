import { useQuery } from "@tanstack/react-query";
import { fetchHomeStats } from "../../../api/siteApi";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";

export const AdminCategoriesPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["home-stats"],
    queryFn: fetchHomeStats,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black">Categories</h2>
      <p className="text-sm text-[var(--text-soft)]">Distribution of confirmed contests by category.</p>

      <div className="grid gap-3 md:grid-cols-2">
        {(data?.categories || []).map((item) => (
          <article key={item.type} className="card flex items-center justify-between p-4">
            <h3 className="font-semibold">{item.type}</h3>
            <span className="badge">{item.count}</span>
          </article>
        ))}
      </div>
    </div>
  );
};
