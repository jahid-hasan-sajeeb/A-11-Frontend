import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllContests } from "../../api/contestApi";
import { ContestCard } from "../../components/common/ContestCard";
import { Pagination } from "../../components/common/Pagination";
import { SectionTitle } from "../../components/common/SectionTitle";

const tabs = ["", "Image Design", "Article Writing", "Business Idea", "Gaming Review", "UI Challenge", "Marketing Pitch", "Video Editing"];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "deadlineAsc", label: "Deadline: Soonest" },
  { value: "deadlineDesc", label: "Deadline: Latest" },
  { value: "feeLow", label: "Entry Fee: Low to High" },
  { value: "feeHigh", label: "Entry Fee: High to Low" },
];

const CardSkeleton = () => (
  <article className="card overflow-hidden">
    <div className="h-48 animate-pulse bg-[var(--surface-2)]" />
    <div className="space-y-3 p-4">
      <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--surface-2)]" />
      <div className="h-3 w-full animate-pulse rounded bg-[var(--surface-2)]" />
      <div className="h-3 w-4/5 animate-pulse rounded bg-[var(--surface-2)]" />
      <div className="h-9 w-28 animate-pulse rounded bg-[var(--surface-2)]" />
    </div>
  </article>
);

export const AllContestsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  const type = searchParams.get("type") || "";
  const search = searchParams.get("search") || "";
  const maxFee = searchParams.get("maxFee") || "";
  const deadlineFrom = searchParams.get("deadlineFrom") || "";
  const sort = searchParams.get("sort") || "newest";

  const { data, isLoading } = useQuery({
    queryKey: ["all-contests", page, type, search, maxFee, deadlineFrom, sort],
    queryFn: () => fetchAllContests({ page, type, search, maxFee, deadlineFrom, sort }),
  });

  const contests = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1 };

  const updateParams = (nextPatch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(nextPatch).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) next.delete(key);
      else next.set(key, String(value));
    });
    next.set("page", "1");
    setPage(1);
    setSearchParams(next);
  };

  return (
    <section className="section-space">
      <div className="container-pad">
        <SectionTitle eyebrow="Explore" title="All Approved Contests" description="Search, filter, sort, and paginate contests from backend data." />

        <form
          className="mb-4 grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 md:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            updateParams({ search: searchInput.trim() });
          }}
        >
          <div className="md:col-span-2">
            <label htmlFor="contest-search" className="mb-1 block text-xs font-semibold text-[var(--text-soft)]">
              Search
            </label>
            <input
              id="contest-search"
              className="input"
              placeholder="Search by title, type, or description"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="contest-max-fee" className="mb-1 block text-xs font-semibold text-[var(--text-soft)]">
              Max Entry Fee
            </label>
            <input
              id="contest-max-fee"
              className="input"
              type="number"
              min="0"
              value={maxFee}
              onChange={(e) => updateParams({ maxFee: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="contest-sort" className="mb-1 block text-xs font-semibold text-[var(--text-soft)]">
              Sort
            </label>
            <select
              id="contest-sort"
              className="input"
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="contest-deadline-from" className="mb-1 block text-xs font-semibold text-[var(--text-soft)]">
              Deadline From
            </label>
            <input
              id="contest-deadline-from"
              className="input"
              type="date"
              value={deadlineFrom}
              onChange={(e) => updateParams({ deadlineFrom: e.target.value })}
            />
          </div>
          <div className="md:col-span-3 flex items-end gap-2">
            <button type="submit" className="btn btn-primary">
              Apply Search
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearchInput("");
                setPage(1);
                setSearchParams(new URLSearchParams({ page: "1" }));
              }}
            >
              Reset
            </button>
          </div>
        </form>

        <div className="mb-5 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab || "all"}
              type="button"
              className={`btn text-sm ${type === tab ? "btn-primary" : "btn-secondary"}`}
              onClick={() => updateParams({ type: tab })}
            >
              {tab || "All"}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, idx) => <CardSkeleton key={`skeleton-${idx}`} />)
            : contests.map((contest, idx) => <ContestCard key={contest._id} contest={contest} index={idx} />)}
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
