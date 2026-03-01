import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="mt-24 border-t border-[var(--border)] bg-[var(--surface)] py-10">
      <div className="container-pad grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">ContestForge</p>
          <h3 className="text-xl font-extrabold">Creative Contest Platform</h3>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            Connect creators and participants through secure, transparent contest workflows.
          </p>
          <p className="mt-3 text-sm text-[var(--text-soft)]">Copyright © 2026 ContestForge</p>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">Quick Links</p>
          <div className="grid gap-2 text-sm text-[var(--text-soft)]">
            <Link to="/about" className="hover:text-[var(--primary)]">
              About
            </Link>
            <Link to="/contact" className="hover:text-[var(--primary)]">
              Contact
            </Link>
            <Link to="/help-center" className="hover:text-[var(--primary)]">
              Help Center
            </Link>
            <Link to="/success-stories" className="hover:text-[var(--primary)]">
              Blog
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">Contact</p>
          <div className="space-y-1 text-sm text-[var(--text-soft)]">
            <p>Email: support@contestforge.dev</p>
            <p>Phone: +880 1700-000000</p>
            <p>Location: Dhaka, Bangladesh</p>
          </div>
          <div className="mt-3 flex gap-3 text-sm text-[var(--text-soft)]">
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
