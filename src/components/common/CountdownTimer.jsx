import { useEffect, useState } from "react";
import dayjs from "dayjs";

const getParts = (deadline) => {
  const now = dayjs();
  const end = dayjs(deadline);

  if (end.isBefore(now)) {
    return { ended: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const diff = end.diff(now, "second");
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  return { ended: false, days, hours, minutes, seconds };
};

export const CountdownTimer = ({ deadline }) => {
  const [value, setValue] = useState(() => getParts(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      setValue(getParts(deadline));
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const label = value.ended ? "Contest Ended" : `${value.days}d ${value.hours}h ${value.minutes}m ${value.seconds}s`;

  return (
    <p className={`font-semibold ${value.ended ? "text-[var(--danger)]" : "text-[var(--success)]"}`}>
      {label}
    </p>
  );
};
