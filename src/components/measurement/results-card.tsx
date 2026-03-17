import { formatCentimeters, formatDateTime } from "@/lib/measurement/format";
import type { MeasurementResult } from "@/lib/types/measurement";
import { CopyResultsButton } from "@/components/measurement/copy-results-button";

type ResultsCardProps = {
  result: MeasurementResult;
  isSaved: boolean;
  onSave: () => void;
  onNewMeasurement: () => void;
};

export function ResultsCard({
  result,
  isSaved,
  onSave,
  onNewMeasurement,
}: ResultsCardProps) {
  return (
    <section className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Resultado
          </p>
          <h2 className="mt-2 font-[var(--font-space-grotesk)] text-2xl font-medium text-[var(--text-strong)]">
            {result.garmentTypeLabel}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
            Medição criada em {formatDateTime(result.createdAt)} com referência de{" "}
            {formatCentimeters(result.reference.realSizeCm)}.
          </p>
        </div>
        <div className="grid gap-3 sm:min-w-52">
          <CopyResultsButton result={result} />
          <button
            type="button"
            onClick={onSave}
            disabled={isSaved}
            className="flex min-h-11 items-center justify-center rounded-2xl bg-[var(--brand)] px-4 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaved ? "Salvo no histórico" : "Salvar localmente"}
          </button>
          <button
            type="button"
            onClick={onNewMeasurement}
            className="flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)]"
          >
            Iniciar nova medição
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-[var(--border-soft)]">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-[var(--surface-alt)] text-left text-[var(--text-soft)]">
            <tr>
              <th className="px-4 py-3 font-medium">Medida</th>
              <th className="px-4 py-3 font-medium">Valor</th>
            </tr>
          </thead>
          <tbody>
            {result.measurements.map((measurement) => (
              <tr
                key={measurement.id}
                className="border-t border-[var(--border-soft)] text-[var(--text-strong)]"
              >
                <td className="px-4 py-3">{measurement.label}</td>
                <td className="px-4 py-3">{formatCentimeters(measurement.valueCm)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
