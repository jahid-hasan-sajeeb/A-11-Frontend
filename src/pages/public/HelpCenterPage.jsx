import { useQuery } from "@tanstack/react-query";
import { fetchHelpCenter } from "../../api/siteApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { SectionTitle } from "../../components/common/SectionTitle";

export const HelpCenterPage = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["help-center"],
    queryFn: fetchHelpCenter,
  });

  return (
    <section className="section-space">
      <div className="container-pad">
        <SectionTitle
          eyebrow="Extra Route"
          title="Help Center"
          description="Guides and answers for creators and participants."
        />

        {isLoading ? <LoadingSpinner /> : null}

        <div className="grid gap-3">
          {data.map((item) => (
            <article key={item.id} className="card p-5">
              <h3 className="font-bold">{item.question}</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
