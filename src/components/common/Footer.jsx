export const Footer = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-24 py-10">
      <div className="container-pad grid gap-4 sm:grid-cols-2 sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">ContestForge</p>
          <h3 className="text-xl font-extrabold">Creative Contest Platform</h3>
          <p className="mt-1 text-sm text-[var(--text-soft)]">Copyright © 2025 ContestForge</p>
        </div>
        <div className="justify-self-start sm:justify-self-end">
          <p className="mb-2 text-sm font-semibold">Connect</p>
          <div className="flex gap-3 text-sm text-[var(--text-soft)]">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[var(--primary)]">
              Facebook
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[var(--primary)]">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
