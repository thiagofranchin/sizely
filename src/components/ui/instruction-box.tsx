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
      className={`rounded-[24px] border px-4 py-4 ${
        tone === "warning"
          ? "border-amber-200 bg-amber-50"
          : "border-[var(--border-soft)] bg-[var(--surface-alt)]"
      }`}
    >
      <h2
        className={`text-sm font-semibold ${
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
