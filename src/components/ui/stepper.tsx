type StepperProps = {
  steps: string[];
  currentIndex: number;
};

export function Stepper({ steps, currentIndex }: StepperProps) {
  return (
    <ol className="grid gap-3 sm:grid-cols-3">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isDone = index < currentIndex;

        return (
          <li
            key={step}
            className={`rounded-[1.6rem] border px-4 py-3 text-sm transition ${
              isActive
                ? "border-primary/30 bg-[color:var(--brand-soft)] text-[var(--text-strong)] shadow-sm"
                : isDone
                  ? "border-[var(--border-strong)] bg-white/70 text-[var(--text-strong)] dark:bg-card/80"
                  : "border-[var(--border-soft)] bg-[color:var(--surface)] text-[var(--text-muted)]"
            }`}
          >
            <span className="block text-xs font-semibold uppercase tracking-[0.14em]">
              Etapa {index + 1}
            </span>
            <span className="mt-1 block text-base font-medium">{step}</span>
          </li>
        );
      })}
    </ol>
  );
}
