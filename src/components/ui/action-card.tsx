import type { ReactNode } from "react";

type ActionCardProps = {
  title: string;
  description: string;
  icon: string;
  action: ReactNode;
};

export function ActionCard({
  title,
  description,
  icon,
  action,
}: ActionCardProps) {
  return (
    <article className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface-alt)] text-xl">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-[var(--font-space-grotesk)] text-xl font-medium text-[var(--text-strong)]">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <div className={description ? "mt-5" : "mt-4"}>{action}</div>
    </article>
  );
}
