import { MeasurementCanvas, type MeasurementCanvasLine } from "@/components/measurement/measurement-canvas";
import { InstructionBox } from "@/components/ui/instruction-box";
import { formatCentimeters } from "@/lib/measurement/format";
import type { MeasurementEntry } from "@/lib/types/measurement";

type GuidedMeasurementStepProps = {
  imageSrc: string;
  measurements: MeasurementEntry[];
  currentIndex: number;
  onPlacePoint: (lineId: string, point: { x: number; y: number }) => void;
  onUpdatePoint: (lineId: string, pointIndex: 0 | 1, point: { x: number; y: number }) => void;
  onRedoCurrent: () => void;
  onSkipCurrent: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
};

const lineColors = ["#0f766e", "#1d4ed8", "#be185d", "#b45309", "#4f46e5", "#047857"];

export function GuidedMeasurementStep({
  imageSrc,
  measurements,
  currentIndex,
  onPlacePoint,
  onUpdatePoint,
  onRedoCurrent,
  onSkipCurrent,
  onPrevious,
  onNext,
  canGoNext,
  canGoPrevious,
}: GuidedMeasurementStepProps) {
  const currentMeasurement = measurements[currentIndex];

  const lines: MeasurementCanvasLine[] = measurements.map((measurement, index) => ({
    id: measurement.id,
    label: measurement.label,
    color: lineColors[index % lineColors.length],
    points: measurement.points,
    active: measurement.id === currentMeasurement.id,
  }));

  return (
    <div className="grid gap-5">
      <InstructionBox
        title={`Medida ${currentIndex + 1} de ${measurements.length}`}
        description={currentMeasurement.instruction}
      />

      <MeasurementCanvas
        imageSrc={imageSrc}
        imageAlt="Imagem carregada para medição"
        lines={lines}
        activeLineId={currentMeasurement.id}
        onPlacePoint={onPlacePoint}
        onUpdatePoint={onUpdatePoint}
      />

      <section className="grid gap-5 rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Medida atual
            </p>
            <h2 className="mt-2 font-[var(--font-space-grotesk)] text-2xl font-medium text-[var(--text-strong)]">
              {currentMeasurement.label}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
              {currentMeasurement.valueCm !== null
                ? `Valor calculado: ${formatCentimeters(currentMeasurement.valueCm)}`
                : currentMeasurement.skipped
                  ? "Medida marcada como não aplicável."
                  : "Toque em dois pontos da imagem para calcular essa medida."}
            </p>
          </div>
          <div className="grid gap-2 sm:min-w-48">
            <button
              type="button"
              onClick={onRedoCurrent}
              className="min-h-11 rounded-2xl border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)]"
            >
              Refazer medida atual
            </button>
            {currentMeasurement.optional ? (
              <button
                type="button"
                onClick={onSkipCurrent}
                className="min-h-11 rounded-2xl border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)]"
              >
                Pular medida opcional
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2">
          {measurements.map((measurement, index) => (
            <div
              key={measurement.id}
              className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm ${
                index === currentIndex
                  ? "bg-[var(--brand-soft)] text-[var(--text-strong)]"
                  : "bg-[var(--surface-alt)] text-[var(--text-soft)]"
              }`}
            >
              <span>{measurement.label}</span>
              <span>
                {measurement.valueCm !== null
                  ? formatCentimeters(measurement.valueCm)
                  : measurement.skipped
                    ? "Não aplicável"
                    : "Pendente"}
              </span>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="min-h-12 rounded-2xl border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Medida anterior
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="min-h-12 rounded-2xl bg-[var(--brand)] px-4 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Próxima medida
          </button>
        </div>
      </section>
    </div>
  );
}
