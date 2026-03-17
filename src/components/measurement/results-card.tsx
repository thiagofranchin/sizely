import { Bookmark, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <section className="luxury-panel p-6 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Resultado
          </p>
          <h2 className="mt-3 text-3xl text-[var(--text-strong)] luxury-title">
            {result.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
            Medição criada em {formatDateTime(result.createdAt)} com referência de{" "}
            {formatCentimeters(result.reference.realSizeCm)}.
          </p>
        </div>
        <div className="grid gap-3 sm:min-w-52">
          <CopyResultsButton result={result} />
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaved}
            className="h-11 rounded-full px-4 text-sm"
          >
            <Bookmark className="size-4" />
            {isSaved ? "Salvo no histórico" : "Salvar localmente"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onNewMeasurement}
            className="h-11 rounded-full bg-white/80 px-4 text-sm dark:bg-card/80"
          >
            <RotateCcw className="size-4" />
            Iniciar nova medição
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-[var(--border-soft)] bg-white/70 dark:bg-card/80">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-[color:var(--surface-alt)] text-left text-[var(--text-soft)]">
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
