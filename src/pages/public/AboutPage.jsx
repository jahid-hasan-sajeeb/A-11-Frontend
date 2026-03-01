import { SectionTitle } from "../../components/common/SectionTitle";

const values = [
  {
    title: "Fair Competition",
    text: "Every contest is reviewed and moderated to keep judging criteria transparent and merit-based.",
  },
  {
    title: "Real Outcomes",
    text: "Participants build portfolios, creators get quality submissions, and winners receive meaningful rewards.",
  },
  {
    title: "Scalable Platform",
    text: "ContestForge is built for secure role-based workflows across participants, creators, and admins.",
  },
];

export const AboutPage = () => {
  return (
    <section className="section-space">
      <div className="container-pad space-y-8">
        <SectionTitle
          eyebrow="About Us"
          title="Why ContestForge Exists"
          description="We built ContestForge to connect creative talent with structured opportunities and measurable growth."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {values.map((item) => (
            <article key={item.title} className="card p-5">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">{item.text}</p>
            </article>
          ))}
        </div>

        <article className="card p-6">
          <h3 className="text-2xl font-black">Platform Highlights</h3>
          <ul className="mt-3 grid gap-2 text-sm text-[var(--text-soft)]">
            <li>Role-based dashboards for users, creators, and admins</li>
            <li>Contest moderation and winner declaration flow</li>
            <li>Secure JWT authentication and protected API routes</li>
            <li>Dynamic leaderboard, winners, and performance analytics</li>
          </ul>
        </article>
      </div>
    </section>
  );
};
