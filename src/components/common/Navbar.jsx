import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/all-contests", label: "Explore" },
  { to: "/about", label: "About" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/success-stories", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const linkClass = ({ isActive }) =>
  `text-sm font-semibold ${isActive ? "text-[var(--primary)]" : "text-[var(--text-soft)] hover:text-[var(--text)]"}`;

export const Navbar = () => {
  const { user, logOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
      <div className="container-pad flex items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <div className="h-9 w-9 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]" />
          <div>
            <p className="text-xs text-[var(--text-soft)]">Contest platform</p>
            <h1 className="text-lg font-extrabold leading-none">ContestForge</h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          {user ? (
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <div className="relative">
              <button
                type="button"
                className="h-10 w-10 overflow-hidden rounded-full border border-[var(--border)]"
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover" />
              </button>
              {profileOpen ? (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl">
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="truncate text-xs text-[var(--text-soft)]">{user.email}</p>
                  <div className="mt-3 grid gap-2">
                    <Link to="/dashboard" className="btn btn-secondary text-center text-sm" onClick={() => setProfileOpen(false)}>
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      className="btn bg-[var(--danger)] text-sm text-white"
                      onClick={async () => {
                        await logOut();
                        setProfileOpen(false);
                        setMobileOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="btn btn-secondary text-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary text-sm">
                Register
              </Link>
            </div>
          )}

          <button
            type="button"
            className="btn btn-secondary px-3 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[var(--border)] md:hidden">
          <nav className="container-pad grid gap-2 py-3">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="badge w-fit" onClick={() => setMobileOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            {user ? (
              <NavLink to="/dashboard" className="badge w-fit" onClick={() => setMobileOpen(false)}>
                Dashboard
              </NavLink>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Link to="/login" className="btn btn-secondary text-sm" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
};
