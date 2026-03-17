import type { ReactNode } from "react";

type ActionCardProps = {
  title: string;
  description: string;
  eyebrow?: string;
  icon: ReactNode;
  action: ReactNode;
};

export function ActionCard({
  title,
  description,
  eyebrow,
  icon,
  action,
}: ActionCardProps) {
  return (
    <article className="luxury-panel relative overflow-hidden p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 to-transparent" />
      <div className="relative flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.4rem] border border-[var(--border-soft)] bg-[var(--brand-soft)] text-primary shadow-sm">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-2 text-2xl text-[var(--text-strong)] luxury-title">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--text-soft)]">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <div className={description ? "relative mt-6" : "relative mt-5"}>{action}</div>
    </article>
  );
}
