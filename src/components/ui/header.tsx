import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

type HeaderProps = {
  title: string;
  description?: string;
  showBackLink?: boolean;
  rightSlot?: ReactNode;
};

export function Header({
  title,
  description,
  showBackLink = false,
  rightSlot,
}: HeaderProps) {
  return (
    <header className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/70 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)] dark:bg-card/80">
            <Sparkles className="size-3.5 text-primary" />
            Sizely
          </div>
          <h1 className="mt-3 hidden text-xl text-[var(--text-strong)] sm:block sm:text-[2rem] luxury-title">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-[var(--text-soft)] sm:block">
              {description}
            </p>
          ) : null}
          <p className="mt-1 text-sm font-medium text-[var(--text-strong)] sm:hidden">
            {title}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {rightSlot}
          {showBackLink ? (
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-full bg-white/70 px-3 dark:bg-card/80",
              )}
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Início</span>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
