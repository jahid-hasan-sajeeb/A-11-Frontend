import { useTheme } from "../../hooks/useTheme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" className="btn btn-secondary text-sm" onClick={toggleTheme}>
      {theme === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
};
