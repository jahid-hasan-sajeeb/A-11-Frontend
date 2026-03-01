import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { fetchPopularContests } from "../../api/contestApi";
import { fetchHelpCenter, fetchHomeStats, fetchRecentWinners } from "../../api/siteApi";
import { ContestCard } from "../../components/common/ContestCard";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { SectionTitle } from "../../components/common/SectionTitle";

export const HomePage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: { search: "" },
  });

  const { data: popular = [], isLoading: popularLoading } = useQuery({
    queryKey: ["popular-contests"],
    queryFn: fetchPopularContests,
  });

  const { data: winners = [] } = useQuery({
    queryKey: ["recent-winners"],
    queryFn: fetchRecentWinners,
  });

  const { data: homeStats } = useQuery({
    queryKey: ["home-stats"],
    queryFn: fetchHomeStats,
  });

  const { data: faqs = [] } = useQuery({
    queryKey: ["help-center-preview"],
    queryFn: fetchHelpCenter,
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
            </p>

            <form
              className="glass flex w-full flex-col gap-3 rounded-2xl p-3 sm:flex-row"
              onSubmit={handleSubmit(({ search }) => {
                navigate(`/all-contests?search=${encodeURIComponent(search)}`);
              })}
            >
              <input className="input" placeholder="Search contests by title, type, or keywords" {...register("search")} />
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
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-pad">
          <SectionTitle
            eyebrow="Platform Stats"
            title="Real-Time Community Overview"
            description="Dynamic numbers pulled from backend collections."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <article className="card p-4">
              <p className="text-xs text-[var(--text-soft)]">Total Users</p>
              <p className="mt-2 text-2xl font-black">{homeStats?.totalUsers || 0}</p>
            </article>
            <article className="card p-4">
              <p className="text-xs text-[var(--text-soft)]">Total Contests</p>
              <p className="mt-2 text-2xl font-black">{homeStats?.totalContests || 0}</p>
            </article>
            <article className="card p-4">
              <p className="text-xs text-[var(--text-soft)]">Active Contests</p>
              <p className="mt-2 text-2xl font-black">{homeStats?.activeContests || 0}</p>
            </article>
            <article className="card p-4">
              <p className="text-xs text-[var(--text-soft)]">Total Participations</p>
              <p className="mt-2 text-2xl font-black">{homeStats?.totalParticipants || 0}</p>
            </article>
            <article className="card p-4">
              <p className="text-xs text-[var(--text-soft)]">Prize Pool</p>
              <p className="mt-2 text-2xl font-black text-[var(--accent)]">${homeStats?.totalPrizePool || 0}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-pad">
          <SectionTitle eyebrow="Most Active" title="Popular Contests" description="Top contests sorted by participation count." />
          {popularLoading ? <LoadingSpinner /> : null}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4" data-aos="fade-up">
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
            eyebrow="Categories"
            title="Contest Categories"
            description="Confirmed contest distribution by category."
          />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {(homeStats?.categories || []).map((item) => (
              <article key={item.type} className="card flex items-center justify-between p-4">
                <h3 className="font-semibold">{item.type}</h3>
                <span className="badge">{item.count}</span>
              </article>
            ))}
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

          <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <article className="card p-4">
              <p className="text-xs text-[var(--text-soft)]">Recent Winners</p>
              <p className="mt-2 text-2xl font-black">{totalWinners}</p>
            </article>
            <article className="card p-4">
              <p className="text-xs text-[var(--text-soft)]">Recent Prize Pool</p>
              <p className="mt-2 text-2xl font-black text-[var(--accent)]">${totalPrize}</p>
            </article>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {winners.map((winner) => (
              <article key={winner.contestId} className="card space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <img src={winner.winnerPhoto} alt={winner.winnerName} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
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
        <div className="container-pad">
          <SectionTitle
            eyebrow="How It Works"
            title="From Registration to Winning"
            description="Simple steps for participants and creators."
          />
          <div className="grid gap-4 md:grid-cols-3">
            <article className="card p-5">
              <h3 className="font-bold">1. Discover</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Browse contests by type, fee, deadline, and popularity.</p>
            </article>
            <article className="card p-5">
              <h3 className="font-bold">2. Participate</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Register, submit your work, and track your progress from dashboard.</p>
            </article>
            <article className="card p-5">
              <h3 className="font-bold">3. Grow</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Win rewards, build your portfolio, and improve your leaderboard rank.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-pad">
          <SectionTitle eyebrow="FAQ" title="Frequently Asked Questions" description="Quick answers for common platform actions." />
          <div className="grid gap-3">
            {faqs.slice(0, 4).map((item) => (
              <article key={item.id} className="card p-5">
                <h3 className="font-bold">{item.question}</h3>
                <p className="mt-2 text-sm text-[var(--text-soft)]">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-pad card grid gap-6 p-6 md:grid-cols-2 md:p-8">
          <div>
            <p className="badge">Creator Resources</p>
            <h3 className="mt-3 text-2xl font-extrabold">Creator Growth Kits</h3>
            <p className="mt-2 text-[var(--text-soft)]">
              Explore task templates, judging scorecards, and prize structuring tips to host higher quality contests.
            </p>
            <div className="mt-4">
              <Link to="/dashboard/add-contest" className="btn btn-primary">
                Start Creating
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Design Brief Template", "Judging Matrix", "Prize Planning", "Submission Quality Guide"].map((item) => (
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
