export const AdminSettingsPage = () => {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black">Admin Settings</h2>
      <p className="text-sm text-[var(--text-soft)]">Operational settings and security reminders for platform admins.</p>

      <div className="grid gap-3">
        <article className="card p-4">
          <h3 className="font-semibold">Security</h3>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            Keep JWT secret strong, rotate compromised credentials, and review role changes periodically.
          </p>
        </article>
        <article className="card p-4">
          <h3 className="font-semibold">Moderation Policy</h3>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            Approve only complete contests with clear instructions, deadline, and valid reward details.
          </p>
        </article>
      </div>
    </div>
  );
};
