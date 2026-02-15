import { useQuery } from "@tanstack/react-query";
import { fetchSuccessStories } from "../../api/siteApi";
import { SectionTitle } from "../../components/common/SectionTitle";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

export const SuccessStoriesPage = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["success-stories"],
    queryFn: fetchSuccessStories,
  });

  return (
    <section className="section-space">
      <div className="container-pad">
        <SectionTitle
          eyebrow="Extra Route"
          title="Success Stories"
          description="Real transformations from contest winners."
        />

        {isLoading ? <LoadingSpinner /> : null}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((story) => (
            <article key={story.id} className="card space-y-3 p-5">
              <h3 className="text-lg font-bold">{story.title}</h3>
              <p className="text-sm text-[var(--text-soft)]">By {story.by}</p>
              <p className="text-sm">{story.summary}</p>
              <p className="font-semibold text-[var(--accent)]">{story.reward}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
