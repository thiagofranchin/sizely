type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-6 py-10 text-center">
      <h2 className="font-[var(--font-space-grotesk)] text-xl font-medium text-[var(--text-strong)]">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-soft)]">
        {description}
      </p>
    </div>
  );
}
