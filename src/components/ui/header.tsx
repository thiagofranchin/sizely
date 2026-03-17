import Link from "next/link";

type HeaderProps = {
  title: string;
  description?: string;
  showBackLink?: boolean;
};

export function Header({ title, description, showBackLink = false }: HeaderProps) {
  return (
    <header className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Sizely
          </p>
          <h1 className="font-[var(--font-space-grotesk)] text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
            {title}
          </h1>
        </div>
        {showBackLink ? (
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)]"
          >
            Início
          </Link>
        ) : null}
      </div>
      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-[var(--text-soft)] sm:text-base">
          {description}
        </p>
      ) : null}
    </header>
  );
}
