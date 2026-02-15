import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const userLinks = [
  { to: "/dashboard/my-participated-contests", label: "My Participated Contests" },
  { to: "/dashboard/my-winning-contests", label: "My Winning Contests" },
  { to: "/dashboard/my-profile", label: "My Profile" },
];

const creatorLinks = [
  { to: "/dashboard/add-contest", label: "Add Contest" },
  { to: "/dashboard/my-created-contests", label: "My Created Contests" },
  { to: "/dashboard/submitted-tasks", label: "Submitted Tasks" },
];

const adminLinks = [
  { to: "/dashboard/manage-users", label: "Manage Users" },
  { to: "/dashboard/manage-contests", label: "Manage Contests" },
];

const linkStyle = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold ${
    isActive ? "bg-[var(--primary)] text-white" : "text-[var(--text-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
  }`;

export const DashboardLayout = () => {
  const { role } = useAuth();

  const links = [
    ...userLinks,
    ...(role === "creator" || role === "admin" ? creatorLinks : []),
    ...(role === "admin" ? adminLinks : []),
  ];

  return (
    <div className="container-pad section-space grid gap-5 lg:grid-cols-[280px_1fr]">
      <aside className="card h-fit p-4">
        <h2 className="mb-3 text-lg font-extrabold">Dashboard</h2>
        <div className="grid gap-2">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkStyle}>
              {link.label}
            </NavLink>
          ))}
        </div>
      </aside>

      <section className="card p-4 md:p-6">
        <Outlet />
      </section>
    </div>
  );
};
