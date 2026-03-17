type StepperProps = {
  steps: string[];
  currentIndex: number;
};

export function Stepper({ steps, currentIndex }: StepperProps) {
  return (
    <ol className="grid gap-3 sm:grid-cols-4">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isDone = index < currentIndex;

        return (
          <li
            key={step}
            className={`rounded-2xl border px-4 py-3 text-sm transition ${
              isActive
                ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--text-strong)]"
                : isDone
                  ? "border-[var(--border-strong)] bg-[var(--surface-alt)] text-[var(--text-strong)]"
                  : "border-[var(--border-soft)] bg-[var(--surface)] text-[var(--text-muted)]"
            }`}
          >
            <span className="block text-xs font-semibold uppercase tracking-[0.14em]">
              Etapa {index + 1}
            </span>
            <span className="mt-1 block font-medium">{step}</span>
          </li>
        );
      })}
    </ol>
  );
}
