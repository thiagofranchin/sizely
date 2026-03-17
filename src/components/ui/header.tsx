import Link from "next/link";
import type { ReactNode } from "react";

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
    <header className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Sizely
          </p>
          <h1 className="hidden font-[var(--font-space-grotesk)] text-xl font-semibold tracking-tight text-[var(--text-strong)] sm:block sm:text-2xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 hidden max-w-2xl text-sm leading-6 text-[var(--text-soft)] sm:block">
              {description}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {rightSlot}
          {showBackLink ? (
            <Link
              href="/"
              className="inline-flex min-h-10 items-center rounded-full border border-[var(--border-strong)] px-3 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)] sm:min-h-11 sm:px-4"
            >
              Início
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
