type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="luxury-panel border-dashed px-6 py-12 text-center">
      <h2 className="text-2xl text-[var(--text-strong)] luxury-title">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-soft)]">
        {description}
      </p>
    </div>
  );
}
