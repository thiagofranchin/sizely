type InstructionBoxProps = {
  title: string;
  description: string;
  tone?: "default" | "warning";
};

export function InstructionBox({
  title,
  description,
  tone = "default",
}: InstructionBoxProps) {
  return (
    <div
      className={`luxury-panel px-5 py-4 ${
        tone === "warning"
          ? "border-amber-200 bg-amber-50/90"
          : "bg-[color:var(--surface-alt)]"
      }`}
    >
      <h2
        className={`text-sm font-semibold uppercase tracking-[0.18em] ${
          tone === "warning" ? "text-amber-950" : "text-[var(--text-strong)]"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-2 text-sm leading-6 ${
          tone === "warning" ? "text-amber-900" : "text-[var(--text-soft)]"
        }`}
      >
        {description}
      </p>
    </div>
  );
}
