export const SectionTitle = ({ eyebrow, title, description }) => {
  return (
    <div className="mb-8 space-y-2">
      {eyebrow ? <p className="badge">{eyebrow}</p> : null}
      <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm text-[var(--text-soft)] md:text-base">{description}</p> : null}
    </div>
  );
};
