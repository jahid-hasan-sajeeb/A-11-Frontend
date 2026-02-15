import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/all-contests", label: "All Contests" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/success-stories", label: "Success Stories" },
  { to: "/help-center", label: "Help Center" },
];

export const Navbar = () => {
  const { user, logOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
      <div className="container-pad flex items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]" />
          <div>
            <p className="text-xs text-[var(--text-soft)]">Contest platform</p>
            <h1 className="text-lg font-extrabold leading-none">ContestForge</h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-semibold ${isActive ? "text-[var(--primary)]" : "text-[var(--text-soft)] hover:text-[var(--text)]"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {user ? (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-sm font-semibold ${isActive ? "text-[var(--primary)]" : "text-[var(--text-soft)] hover:text-[var(--text)]"}`
              }
            >
              Dashboard
            </NavLink>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <div className="relative">
              <button type="button" className="h-10 w-10 overflow-hidden rounded-full border border-[var(--border)]" onClick={() => setOpen((prev) => !prev)}>
                <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover" />
              </button>
              {open ? (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl">
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="truncate text-xs text-[var(--text-soft)]">{user.email}</p>
                  <div className="mt-3 grid gap-2">
                    <Link to="/dashboard" className="btn btn-secondary text-center text-sm" onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      className="btn bg-[var(--danger)] text-sm text-white"
                      onClick={async () => {
                        await logOut();
                        setOpen(false);
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
        </div>
      </div>

      <div className="container-pad flex gap-3 overflow-x-auto pb-3 md:hidden">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className="badge whitespace-nowrap">
            {item.label}
          </NavLink>
        ))}
        {user ? (
          <NavLink to="/dashboard" className="badge whitespace-nowrap">
            Dashboard
          </NavLink>
        ) : null}
      </div>
    </header>
  );
};
