"use client";

import { useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Plus, Ruler, ScissorsLineDashed, Trash2 } from "lucide-react";
import { ReferenceStep } from "@/components/measurement/reference-step";
import { ResultsCard } from "@/components/measurement/results-card";
import { MeasurementCanvas, type MeasurementCanvasLine } from "@/components/measurement/measurement-canvas";
import { EmptyState } from "@/components/ui/empty-state";
import { Header } from "@/components/ui/header";
import { Stepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { formatCentimeters } from "@/lib/measurement/format";
import {
  calculateDistanceInPixels,
  calculateScaleCmPerPixel,
  convertPixelsToCentimeters,
  pointsAreValid,
} from "@/lib/measurement/math";
import { clearDraft, readDraft } from "@/lib/storage/draft";
import { appendHistoryItem } from "@/lib/storage/history";
import { createId } from "@/lib/utils/id";
import { cn } from "@/lib/utils";
import type { LinePoints, MeasurementEntry, MeasurementResult, Point } from "@/lib/types/measurement";

const steps = ["Referência", "Medidas", "Resultado"];
const emptySubscribe = () => () => undefined;
const lineColors = ["#0f766e", "#1d4ed8", "#be185d", "#b45309", "#4f46e5", "#047857"];

function parseCentimeterInput(value: string) {
  const normalized = Number(value.replace(",", "."));
  return Number.isFinite(normalized) ? normalized : 0;
}

function createMeasurement(label: string): MeasurementEntry {
  return {
    id: createId(),
    label,
    points: [null, null],
    valueCm: null,
  };
}

function recalculateMeasurement(
  measurement: MeasurementEntry,
  scaleCmPerPixel: number | null,
) {
  if (!scaleCmPerPixel || !pointsAreValid(measurement.points)) {
    return {
      ...measurement,
      valueCm: null,
    };
  }

  const pixelDistance = calculateDistanceInPixels(
    measurement.points[0],
    measurement.points[1],
  );

  return {
    ...measurement,
    valueCm: convertPixelsToCentimeters(pixelDistance, scaleCmPerPixel),
  };
}

export default function MeasurePage() {
  const router = useRouter();
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const draft = isHydrated ? readDraft() : null;
  const [referencePoints, setReferencePoints] = useState<LinePoints>([null, null]);
  const [referenceInput, setReferenceInput] = useState("");
  const [measurements, setMeasurements] = useState<MeasurementEntry[]>([
    createMeasurement("Medida 1"),
  ]);
  const [activeMeasurementId, setActiveMeasurementId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<MeasurementResult | null>(null);
  const [savedHistoryId, setSavedHistoryId] = useState<string | null>(null);

  const referenceRealSizeCm = referenceInput ? parseCentimeterInput(referenceInput) : null;
  const referencePixelDistance = pointsAreValid(referencePoints)
    ? calculateDistanceInPixels(referencePoints[0], referencePoints[1])
    : 0;
  const scaleCmPerPixel =
    referenceRealSizeCm && referencePixelDistance
      ? calculateScaleCmPerPixel(referenceRealSizeCm, referencePixelDistance)
      : null;
  const displayedMeasurements = measurements.map((measurement) =>
    recalculateMeasurement(measurement, scaleCmPerPixel),
  );
  const activeMeasurement =
    displayedMeasurements.find((measurement) => measurement.id === activeMeasurementId) ??
    displayedMeasurements[0] ??
    null;

  function updateReferencePoint(pointIndex: 0 | 1, point: Point) {
    setReferencePoints((currentPoints) => {
      const nextPoints = [...currentPoints] as typeof currentPoints;
      nextPoints[pointIndex] = point;
      return nextPoints;
    });
  }

  function handleCanvasPlacePoint(lineId: string, point: Point) {
    if (lineId === "reference") {
      if (!referencePoints[0]) {
        updateReferencePoint(0, point);
        return;
      }

      updateReferencePoint(1, point);
      return;
    }

    setMeasurements((currentMeasurements) =>
      currentMeasurements.map((measurement) => {
        if (measurement.id !== lineId) {
          return measurement;
        }

        const nextPoints = [...measurement.points] as typeof measurement.points;

        if (!nextPoints[0]) {
          nextPoints[0] = point;
        } else {
          nextPoints[1] = point;
        }

        return {
          ...measurement,
          points: nextPoints,
        };
      }),
    );
  }

  function handleCanvasUpdatePoint(lineId: string, pointIndex: 0 | 1, point: Point) {
    if (lineId === "reference") {
      updateReferencePoint(pointIndex, point);
      return;
    }

    setMeasurements((currentMeasurements) =>
      currentMeasurements.map((measurement) => {
        if (measurement.id !== lineId) {
          return measurement;
        }

        const nextPoints = [...measurement.points] as typeof measurement.points;
        nextPoints[pointIndex] = point;

        return {
          ...measurement,
          points: nextPoints,
        };
      }),
    );
  }

  function handleAddMeasurement() {
    const nextMeasurement = createMeasurement(`Medida ${measurements.length + 1}`);
    setMeasurements((currentMeasurements) => [...currentMeasurements, nextMeasurement]);
    setActiveMeasurementId(nextMeasurement.id);
  }

  function handleResetMeasurement(measurementId: string) {
    setMeasurements((currentMeasurements) =>
      currentMeasurements.map((measurement) =>
        measurement.id === measurementId
          ? {
              ...measurement,
              points: [null, null],
              valueCm: null,
            }
          : measurement,
      ),
    );
  }

  function handleRemoveMeasurement(measurementId: string) {
    setMeasurements((currentMeasurements) => {
      const nextMeasurements = currentMeasurements.filter(
        (measurement) => measurement.id !== measurementId,
      );

      if (nextMeasurements.length === 0) {
        const fallbackMeasurement = createMeasurement("Medida 1");
        setActiveMeasurementId(fallbackMeasurement.id);
        return [fallbackMeasurement];
      }

      if (activeMeasurementId === measurementId) {
        setActiveMeasurementId(nextMeasurements[0].id);
      }

      return nextMeasurements;
    });
  }

  function handleUpdateMeasurementLabel(measurementId: string, label: string) {
    setMeasurements((currentMeasurements) =>
      currentMeasurements.map((measurement) =>
        measurement.id === measurementId
          ? {
              ...measurement,
              label,
            }
          : measurement,
      ),
    );
  }

  function handleBuildResult() {
    if (!draft || !referenceRealSizeCm || !scaleCmPerPixel) {
      return;
    }

    const nextResult: MeasurementResult = {
      title: "Medição livre",
      createdAt: new Date().toISOString(),
      sourceName: draft.sourceName,
      sourceKind: draft.sourceKind,
      reference: {
        realSizeCm: referenceRealSizeCm,
        pixelDistance: referencePixelDistance,
        scaleCmPerPixel,
      },
      measurements: displayedMeasurements.map((measurement) => ({
        id: measurement.id,
        label: measurement.label.trim() || "Medida sem nome",
        valueCm: measurement.valueCm,
      })),
    };

    setResult(nextResult);
    setCurrentStep(2);
  }

  function handleSaveResult() {
    if (!result || savedHistoryId) {
      return;
    }

    const historyId = createId();
    appendHistoryItem({
      ...result,
      id: historyId,
      savedAt: new Date().toISOString(),
    });
    setSavedHistoryId(historyId);
  }

  function startNewMeasurement() {
    clearDraft();
    router.push("/");
  }

  const canAdvanceFromReference =
    pointsAreValid(referencePoints) && Boolean(referenceRealSizeCm && scaleCmPerPixel);
  const measurementLines: MeasurementCanvasLine[] = [
    {
      id: "reference",
      label: "Referência",
      overlayValue: referenceRealSizeCm ? formatCentimeters(referenceRealSizeCm) : undefined,
      color: "#2563eb",
      points: referencePoints,
    },
    ...displayedMeasurements.map((measurement, index) => ({
      id: measurement.id,
      label: measurement.label.trim() || `Medida ${index + 1}`,
      overlayValue:
        measurement.valueCm !== null ? formatCentimeters(measurement.valueCm) : "Pendente",
      color: lineColors[index % lineColors.length],
      points: measurement.points,
      active: measurement.id === activeMeasurement?.id,
    })),
  ];

  if (!draft) {
    return (
      <main className="luxury-shell max-w-5xl">
        <section className="luxury-panel px-5 py-5 sm:px-7">
          <Header
            title="Medição"
            description="Comece pela tela inicial para tirar uma foto ou selecionar um arquivo antes de medir."
            showBackLink
          />
        </section>
        <EmptyState
          title="Fluxo aguardando imagem"
          description="O Sizely precisa de uma foto para abrir a área de medição. Volte à tela inicial e escolha uma imagem."
        />
      </main>
    );
  }

  return (
    <main className="luxury-shell">
      <section className="luxury-panel px-5 py-5 sm:px-7">
        <Header
          title="Medidor livre"
          description={`Imagem atual: ${draft.sourceName}. Calibre a referência, adicione quantas medidas quiser e ajuste os pontos diretamente na imagem.`}
          showBackLink
        />
      </section>

      <Stepper steps={steps} currentIndex={currentStep} />

      {currentStep === 0 ? (
        <section className="grid gap-5">
          <ReferenceStep
            imageSrc={draft.imageDataUrl}
            points={referencePoints}
            referenceSizeCm={referenceInput}
            scaleCmPerPixel={scaleCmPerPixel}
            onReferenceSizeChange={setReferenceInput}
            onPlacePoint={handleCanvasPlacePoint}
            onUpdatePoint={handleCanvasUpdatePoint}
            onReset={() => {
              setReferencePoints([null, null]);
              setReferenceInput("");
            }}
          />
          <Button
            type="button"
            onClick={() => setCurrentStep(1)}
            disabled={!canAdvanceFromReference}
            className="h-12 rounded-full px-5 text-sm shadow-sm"
          >
            <Ruler className="size-4" />
            Ir para medições
            <ChevronRight className="size-4" />
          </Button>
        </section>
      ) : null}

      {currentStep === 1 ? (
        <section className="grid gap-5">
          <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr] [&>*]:min-w-0">
            <MeasurementCanvas
              imageSrc={draft.imageDataUrl}
              imageAlt="Imagem carregada para medição livre"
              lines={measurementLines}
              activeLineId={activeMeasurement?.id ?? "reference"}
              onPlacePoint={handleCanvasPlacePoint}
              onUpdatePoint={handleCanvasUpdatePoint}
              onAddMeasurement={handleAddMeasurement}
              addMeasurementLabel="Adicionar medida"
            />

            <section className="luxury-panel min-w-0 grid gap-4 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    Medidas
                  </p>
                  <h2 className="mt-2 text-3xl text-[var(--text-strong)] luxury-title">
                    Adicione e ajuste livremente
                  </h2>
                </div>
                <Button
                  type="button"
                  onClick={handleAddMeasurement}
                  size="icon-lg"
                  className="rounded-full shadow-sm"
                  aria-label="Adicionar medida"
                >
                  <Plus className="size-6" />
                </Button>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
                {displayedMeasurements.map((measurement, index) => {
                  const isActive = measurement.id === activeMeasurement?.id;
                  const measurementLabel = measurement.label.trim() || `Medida ${index + 1}`;

                  return (
                    <div
                      key={measurement.id}
                      className={`min-w-0 rounded-[24px] border p-4 transition ${
                        isActive
                          ? "border-primary/35 bg-[color:var(--brand-soft)] shadow-sm"
                          : "border-[var(--border-soft)] bg-white/70 dark:bg-card/80"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveMeasurementId(measurement.id)}
                        className="mb-3 flex w-full items-center justify-between gap-3 text-left"
                      >
                        <div className="min-w-0">
                          <span className="block text-sm font-semibold text-[var(--text-strong)]">
                            {measurementLabel}
                          </span>
                          <span className="block text-xs text-[var(--text-soft)]">
                            {isActive ? "Medida ativa" : `Medida ${index + 1}`}
                          </span>
                        </div>
                        <span className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-[var(--text-soft)] dark:bg-card/80 sm:text-[0.95rem]">
                          {measurement.valueCm !== null
                            ? formatCentimeters(measurement.valueCm)
                            : "Pendente"}
                        </span>
                      </button>

                      <label className="grid gap-2">
                        <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
                          Nome da medida
                        </span>
                        <input
                          type="text"
                          value={measurement.label}
                          onChange={(event) =>
                            handleUpdateMeasurementLabel(measurement.id, event.target.value)
                          }
                          onFocus={() => setActiveMeasurementId(measurement.id)}
                          className="min-h-11 w-full min-w-0 max-w-full rounded-[1.1rem] border border-[var(--border-soft)] bg-white/90 px-4 text-sm text-slate-900 outline-none transition focus:border-primary dark:bg-card/90 dark:text-foreground"
                          placeholder={`Ex.: Medida ${index + 1}`}
                        />
                      </label>

                      <div className="mt-3 grid grid-cols-1 gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setActiveMeasurementId(measurement.id);
                            handleResetMeasurement(measurement.id);
                          }}
                          aria-label={`Medir ${measurementLabel}`}
                          className="h-10 w-full rounded-full bg-white/80 px-3 text-sm dark:bg-card/80"
                        >
                          <ScissorsLineDashed className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleRemoveMeasurement(measurement.id)}
                          aria-label={`Excluir ${measurementLabel}`}
                          className="h-10 w-full rounded-full border-red-200 bg-white/80 px-3 text-sm text-red-700 hover:bg-red-50 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-950/60"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(0)}
              className="h-12 rounded-full bg-white/80 px-5 text-sm dark:bg-card/80"
            >
              Ajustar referência
            </Button>
            <Button
              type="button"
              onClick={handleBuildResult}
              disabled={!displayedMeasurements.some((measurement) => measurement.valueCm !== null)}
              className="h-12 rounded-full px-5 text-sm shadow-sm"
            >
              Ver resultados
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <footer className="luxury-panel px-4 py-4 text-sm leading-6 text-[var(--text-soft)]">
            Toque com a medida ativa selecionada para marcar dois pontos. Arraste um ponto já criado para corrigir. Use o botão <span className="font-semibold text-[var(--text-strong)]">+</span> para adicionar novas medidas.
          </footer>
        </section>
      ) : null}

      {currentStep === 2 && result ? (
        <section className="grid gap-5">
          <ResultsCard
            result={result}
            isSaved={Boolean(savedHistoryId)}
            onSave={handleSaveResult}
            onNewMeasurement={startNewMeasurement}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="h-12 rounded-full bg-white/80 px-5 text-sm dark:bg-card/80"
            >
              Voltar para medições
            </Button>
            <Link
              href="/historico"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 rounded-full bg-white/80 px-5 text-sm dark:bg-card/80",
              )}
            >
              Abrir histórico local
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
