import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllContests } from "../../api/contestApi";
import { ContestCard } from "../../components/common/ContestCard";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Pagination } from "../../components/common/Pagination";
import { SectionTitle } from "../../components/common/SectionTitle";

const tabs = ["", "Image Design", "Article Writing", "Business Idea", "Gaming Review", "UI Challenge", "Marketing Pitch", "Video Editing"];

export const AllContestsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));

  const type = searchParams.get("type") || "";
  const search = searchParams.get("search") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["all-contests", page, type, search],
    queryFn: () => fetchAllContests({ page, type, search }),
  });

  const contests = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1 };

  return (
    <section className="section-space">
      <div className="container-pad">
        <SectionTitle
          eyebrow="Explore"
          title="All Approved Contests"
          description="Filter contests by type and open details to participate."
        />

        <div className="mb-5 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab || "all"}
              type="button"
              className={`btn text-sm ${type === tab ? "btn-primary" : "btn-secondary"}`}
              onClick={() => {
                setPage(1);
                const next = new URLSearchParams(searchParams);
                if (tab) next.set("type", tab);
                else next.delete("type");
                next.set("page", "1");
                setSearchParams(next);
              }}
            >
              {tab || "All"}
            </button>
          ))}
        </div>

        {isLoading ? <LoadingSpinner /> : null}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {contests.map((contest, idx) => (
            <ContestCard key={contest._id} contest={contest} index={idx} />
          ))}
        </div>

        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          onPageChange={(nextPage) => {
            setPage(nextPage);
            const next = new URLSearchParams(searchParams);
            next.set("page", String(nextPage));
            setSearchParams(next);
          }}
        />
      </div>
    </section>
  );
};
