import { useEffect, useState } from "react";
import { applyTheme, readSavedTheme } from "../utils/theme";

export const useTheme = () => {
  const [theme, setTheme] = useState(readSavedTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
};
