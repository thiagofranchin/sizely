"use client";

import { useEffect, useSyncExternalStore, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";

const THEME_STORAGE_KEY = "sizely-theme";
const emptySubscribe = () => () => undefined;

function getPreferredTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => getPreferredTheme());
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [isHydrated, theme]);

  if (!isHydrated) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-full bg-white/70 px-3 dark:bg-card/80"
      onClick={() => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      }}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {theme === "dark" ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
      <span className="hidden sm:inline">{theme === "dark" ? "Claro" : "Escuro"}</span>
    </Button>
  );
}
