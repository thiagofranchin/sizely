"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GarmentTypeSelector } from "@/components/garment/garment-type-selector";
import { GuidedMeasurementStep } from "@/components/measurement/guided-measurement-step";
import { ReferenceStep } from "@/components/measurement/reference-step";
import { ResultsCard } from "@/components/measurement/results-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Header } from "@/components/ui/header";
import { InstructionBox } from "@/components/ui/instruction-box";
import { Stepper } from "@/components/ui/stepper";
import {
  GARMENT_TYPES,
  buildMeasurementEntries,
  getGarmentDefinition,
} from "@/lib/constants/garments";
import {
  calculateDistanceInPixels,
  calculateScaleCmPerPixel,
  convertPixelsToCentimeters,
  pointsAreValid,
} from "@/lib/measurement/math";
import { clearDraft, readDraft } from "@/lib/storage/draft";
import { appendHistoryItem } from "@/lib/storage/history";
import { createId } from "@/lib/utils/id";
import type {
  GarmentTypeId,
  LinePoints,
  MeasurementEntry,
  MeasurementResult,
  Point,
} from "@/lib/types/measurement";

const steps = ["Tipo da peça", "Referência", "Medidas", "Resultado"];

function parseCentimeterInput(value: string) {
  const normalized = Number(value.replace(",", "."));
  return Number.isFinite(normalized) ? normalized : 0;
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
    skipped: false,
  };
}

export default function MeasurePage() {
  const router = useRouter();
  const draft = useSyncExternalStore(
    () => () => undefined,
    readDraft,
    () => null,
  );
  const [garmentTypeId, setGarmentTypeId] = useState<GarmentTypeId | null>(null);
  const [referencePoints, setReferencePoints] = useState<LinePoints>([null, null]);
  const [referenceInput, setReferenceInput] = useState("");
  const [measurements, setMeasurements] = useState<MeasurementEntry[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentMeasurementIndex, setCurrentMeasurementIndex] = useState(0);
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

  function handleSelectGarmentType(nextGarmentTypeId: GarmentTypeId) {
    setGarmentTypeId(nextGarmentTypeId);
    setMeasurements(buildMeasurementEntries(getGarmentDefinition(nextGarmentTypeId).measurements));
    setCurrentMeasurementIndex(0);
    setResult(null);
    setSavedHistoryId(null);
  }

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

        return recalculateMeasurement(
          {
            ...measurement,
            points: nextPoints,
            skipped: false,
          },
          scaleCmPerPixel,
        );
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

        return recalculateMeasurement(
          {
            ...measurement,
            points: nextPoints,
            skipped: false,
          },
          scaleCmPerPixel,
        );
      }),
    );
  }

  function handleRedoCurrentMeasurement() {
    const activeMeasurement = measurements[currentMeasurementIndex];

    if (!activeMeasurement) {
      return;
    }

    setMeasurements((currentMeasurements) =>
      currentMeasurements.map((measurement) =>
        measurement.id === activeMeasurement.id
          ? {
              ...measurement,
              points: [null, null],
              valueCm: null,
              skipped: false,
            }
          : measurement,
      ),
    );
  }

  function handleSkipCurrentMeasurement() {
    const activeMeasurement = measurements[currentMeasurementIndex];

    if (!activeMeasurement?.optional) {
      return;
    }

    setMeasurements((currentMeasurements) =>
      currentMeasurements.map((measurement) =>
        measurement.id === activeMeasurement.id
          ? {
              ...measurement,
              points: [null, null],
              valueCm: null,
              skipped: true,
            }
          : measurement,
      ),
    );
  }

  function handleBuildResult() {
    if (!draft || !garmentTypeId || !referenceRealSizeCm || !scaleCmPerPixel) {
      return;
    }

    const garmentDefinition = getGarmentDefinition(garmentTypeId);

    const nextResult: MeasurementResult = {
      garmentTypeId,
      garmentTypeLabel: garmentDefinition.label,
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
        label: measurement.label,
        valueCm: measurement.valueCm,
        optional: measurement.optional,
        skipped: measurement.skipped,
      })),
    };

    setResult(nextResult);
    setCurrentStep(3);
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

  const selectedGarment = garmentTypeId ? getGarmentDefinition(garmentTypeId) : null;
  const currentMeasurement = displayedMeasurements[currentMeasurementIndex];
  const canAdvanceFromReference =
    pointsAreValid(referencePoints) && Boolean(referenceRealSizeCm && scaleCmPerPixel);
  const canAdvanceMeasurement = Boolean(
    currentMeasurement && (currentMeasurement.valueCm !== null || currentMeasurement.skipped),
  );

  if (!draft) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-6 shadow-[var(--shadow-card)] sm:px-7">
          <Header
            title="Nenhuma imagem carregada"
            description="Comece pela tela inicial para tirar uma foto ou selecionar um arquivo antes de medir."
            showBackLink
          />
        </section>
        <EmptyState
          title="Fluxo aguardando imagem"
          description="O Sizely precisa de uma foto para abrir a área de medição. Volte à tela inicial e escolha uma imagem da peça."
        />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-6 shadow-[var(--shadow-card)] sm:px-7">
        <Header
          title="Fluxo guiado de medição"
          description={`Imagem atual: ${draft.sourceName}. Siga as etapas abaixo e ajuste os pontos sempre que precisar refinar a medição.`}
          showBackLink
        />
      </section>

      <Stepper steps={steps} currentIndex={currentStep} />

      {currentStep === 0 ? (
        <section className="grid gap-5 rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
          <InstructionBox
            title="Escolha o tipo da peça"
            description="A seleção define quais medidas serão solicitadas no fluxo guiado. Você pode trocar o tipo antes de avançar."
          />
          <GarmentTypeSelector
            garmentTypes={GARMENT_TYPES}
            selectedGarmentTypeId={garmentTypeId}
            onSelect={handleSelectGarmentType}
          />
          {selectedGarment ? (
            <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-alt)] p-4">
              <h2 className="font-[var(--font-space-grotesk)] text-lg font-medium text-[var(--text-strong)]">
                Medidas que serão coletadas
              </h2>
              <ul className="mt-3 grid gap-2 text-sm text-[var(--text-soft)]">
                {selectedGarment.measurements.map((measurement) => (
                  <li
                    key={measurement.id}
                    className="rounded-2xl bg-[var(--surface)] px-4 py-3"
                  >
                    {measurement.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            disabled={!garmentTypeId}
            className="min-h-12 rounded-2xl bg-[var(--brand)] px-4 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continuar para referência
          </button>
        </section>
      ) : null}

      {currentStep === 1 ? (
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
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setCurrentStep(0)}
              className="min-h-12 rounded-2xl border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)]"
            >
              Voltar ao tipo da peça
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              disabled={!canAdvanceFromReference}
              className="min-h-12 rounded-2xl bg-[var(--brand)] px-4 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continuar para medidas
            </button>
          </div>
        </section>
      ) : null}

      {currentStep === 2 && currentMeasurement ? (
        <section className="grid gap-5">
          <GuidedMeasurementStep
            imageSrc={draft.imageDataUrl}
            measurements={displayedMeasurements}
            currentIndex={currentMeasurementIndex}
            onPlacePoint={handleCanvasPlacePoint}
            onUpdatePoint={handleCanvasUpdatePoint}
            onRedoCurrent={handleRedoCurrentMeasurement}
            onSkipCurrent={handleSkipCurrentMeasurement}
            onPrevious={() => {
              if (currentMeasurementIndex === 0) {
                setCurrentStep(1);
                return;
              }

              setCurrentMeasurementIndex((value) => value - 1);
            }}
            onNext={() => {
              if (!canAdvanceMeasurement) {
                return;
              }

              if (currentMeasurementIndex === displayedMeasurements.length - 1) {
                handleBuildResult();
                return;
              }

              setCurrentMeasurementIndex((value) => value + 1);
            }}
            canGoNext={canAdvanceMeasurement}
            canGoPrevious={currentMeasurementIndex > 0}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="min-h-12 rounded-2xl border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)]"
            >
              Ajustar referência
            </button>
            <button
              type="button"
              onClick={handleBuildResult}
              disabled={
                !displayedMeasurements.every(
                  (measurement) => measurement.valueCm !== null || measurement.skipped,
                )
              }
              className="min-h-12 rounded-2xl border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Fechar medição agora
            </button>
          </div>
        </section>
      ) : null}

      {currentStep === 3 && result ? (
        <section className="grid gap-5">
          <ResultsCard
            result={result}
            isSaved={Boolean(savedHistoryId)}
            onSave={handleSaveResult}
            onNewMeasurement={startNewMeasurement}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="min-h-12 rounded-2xl border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)]"
            >
              Voltar para ajuste
            </button>
            <Link
              href="/historico"
              className="flex min-h-12 items-center justify-center rounded-2xl border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)]"
            >
              Abrir histórico local
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
