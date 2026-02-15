import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { fetchPopularContests } from "../../api/contestApi";
import { fetchRecentWinners } from "../../api/siteApi";
import { ContestCard } from "../../components/common/ContestCard";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { SectionTitle } from "../../components/common/SectionTitle";

export const HomePage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: { search: "" },
  });

  const { data: popular = [], isLoading } = useQuery({
    queryKey: ["popular-contests"],
    queryFn: fetchPopularContests,
  });

  const { data: winners = [] } = useQuery({
    queryKey: ["recent-winners"],
    queryFn: fetchRecentWinners,
  });

  const totalWinners = winners.length;
  const totalPrize = winners.reduce((sum, winner) => sum + Number(winner.prizeMoney || 0), 0);

  return (
    <>
      <section className="section-space">
        <div className="container-pad grid items-center gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6" data-aos="fade-up">
            <span className="badge">Discover. Participate. Win.</span>
            <h2 className="text-4xl font-black leading-tight md:text-5xl">
              Build your creative career through verified contests.
            </h2>
            <p className="max-w-xl text-[var(--text-soft)] md:text-lg">
              Join design, writing, and innovation competitions curated by creators and approved by admins.
              Compete fairly and collect real achievements.
            </p>

            <form
              className="glass flex w-full flex-col gap-3 rounded-2xl p-3 sm:flex-row"
              onSubmit={handleSubmit(({ search }) => {
                navigate(`/all-contests?search=${encodeURIComponent(search)}`);
              })}
            >
              <input
                className="input"
                placeholder="Search by contest type (e.g. Image Design)"
                {...register("search")}
              />
              <button type="submit" className="btn btn-accent whitespace-nowrap">
                Search Contests
              </button>
            </form>
          </div>

          <div className="card overflow-hidden" data-aos="zoom-in">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
              alt="Contest collaboration"
              className="h-[360px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-pad">
          <SectionTitle
            eyebrow="Most Active"
            title="Popular Contests"
            description="Top contests sorted by participation count."
          />
          {isLoading ? <LoadingSpinner /> : null}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-aos="fade-up">
            {popular.map((contest, idx) => (
              <ContestCard key={contest._id} contest={contest} index={idx} />
            ))}
          </div>
          <div className="mt-6" data-aos="fade-up">
            <Link to="/all-contests" className="btn btn-primary inline-flex">
              Show All Contests
            </Link>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-pad">
          <SectionTitle
            eyebrow="Winner Spotlight"
            title="Recent Champions"
            description="Celebrate winners and get inspired by real achievements."
          />

          <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-aos="fade-up">
            <article className="card p-4">
              <p className="text-xs text-[var(--text-soft)]">Recent Winners</p>
              <p className="mt-2 text-2xl font-black">{totalWinners}</p>
            </article>
            <article className="card p-4">
              <p className="text-xs text-[var(--text-soft)]">Recent Prize Pool</p>
              <p className="mt-2 text-2xl font-black text-[var(--accent)]">${totalPrize}</p>
            </article>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-aos="fade-up">
            {winners.map((winner) => (
              <article key={winner.contestId} className="card space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <img src={winner.winnerPhoto} alt={winner.winnerName} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold">{winner.winnerName}</p>
                    <p className="text-xs text-[var(--text-soft)]">Won ${winner.prizeMoney}</p>
                  </div>
                </div>
                <h3 className="font-semibold">{winner.contestName}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-pad card grid gap-6 p-6 md:grid-cols-2 md:p-8" data-aos="fade-up">
          <div>
            <p className="badge">Extra Section</p>
            <h3 className="mt-3 text-2xl font-extrabold">Creator Growth Kits</h3>
            <p className="mt-2 text-[var(--text-soft)]">
              Explore proven task templates, judging scorecards, and prize structuring tips to host higher quality contests.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Design Brief Template",
              "Judging Matrix",
              "Prize Planning",
              "Submission Quality Guide",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm font-semibold">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
