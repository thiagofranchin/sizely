 "use client";

import { useEffect, useRef, useState } from "react";
import { MeasurementCanvas, type MeasurementCanvasLine } from "@/components/measurement/measurement-canvas";
import { InstructionBox } from "@/components/ui/instruction-box";
import { formatCentimeters } from "@/lib/measurement/format";
import { calculateDistanceInPixels, pointsAreValid } from "@/lib/measurement/math";
import type { LinePoints } from "@/lib/types/measurement";

type ReferenceStepProps = {
  imageSrc: string;
  points: LinePoints;
  referenceSizeCm: string;
  scaleCmPerPixel: number | null;
  onReferenceSizeChange: (value: string) => void;
  onPlacePoint: (lineId: string, point: { x: number; y: number }) => void;
  onUpdatePoint: (lineId: string, pointIndex: 0 | 1, point: { x: number; y: number }) => void;
  onReset: () => void;
};

export function ReferenceStep({
  imageSrc,
  points,
  referenceSizeCm,
  scaleCmPerPixel,
  onReferenceSizeChange,
  onPlacePoint,
  onUpdatePoint,
  onReset,
}: ReferenceStepProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [shouldPulse, setShouldPulse] = useState(false);
  const lines: MeasurementCanvasLine[] = [
    {
      id: "reference",
      label: "Referência",
      color: "#2563eb",
      points,
      active: true,
    },
  ];

  const referenceDistance = pointsAreValid(points)
    ? calculateDistanceInPixels(points[0], points[1])
    : null;

  useEffect(() => {
    if (!pointsAreValid(points) || referenceSizeCm) {
      return;
    }

    const input = inputRef.current;

    if (!input) {
      return;
    }

    input.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    window.setTimeout(() => {
      input.focus();
      setShouldPulse(true);
      window.setTimeout(() => setShouldPulse(false), 1200);
    }, 220);
  }, [points, referenceSizeCm]);

  return (
    <div className="grid gap-5">
      <InstructionBox
        title="Calibração manual"
        description="Marque dois pontos no objeto de referência, informe a medida real em centímetros e ajuste os pontos se necessário antes de continuar."
      />

      <MeasurementCanvas
        imageSrc={imageSrc}
        imageAlt="Imagem carregada para calibração"
        lines={lines}
        activeLineId="reference"
        onPlacePoint={onPlacePoint}
        onUpdatePoint={onUpdatePoint}
      />

      <div className="grid gap-4 rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-[var(--text-strong)]">
            Medida real do objeto de referência
          </span>
          <input
            ref={inputRef}
            type="number"
            inputMode="decimal"
            min="0"
            step="0.1"
            value={referenceSizeCm}
            onChange={(event) => onReferenceSizeChange(event.target.value)}
            placeholder="Ex.: 8,5"
            className={`min-h-12 rounded-2xl border bg-white px-4 text-base text-slate-900 outline-none transition focus:border-[var(--brand)] ${
              shouldPulse
                ? "border-[var(--brand)] shadow-[0_0_0_4px_rgba(191,216,191,0.55)]"
                : "border-[var(--border-soft)]"
            }`}
          />
        </label>

        <div className="grid gap-2 text-sm text-[var(--text-soft)]">
          <p>
            Distância na imagem:{" "}
            {referenceDistance ? `${referenceDistance.toFixed(1).replace(".", ",")} px` : "Aguardando marcação"}
          </p>
          <p>
            Escala calculada:{" "}
            {scaleCmPerPixel ? `${scaleCmPerPixel.toFixed(4).replace(".", ",")} cm/px` : "Aguardando dados válidos"}
          </p>
          <p>
            Referência informada:{" "}
            {referenceSizeCm ? formatCentimeters(Number(referenceSizeCm.replace(",", "."))) : "Aguardando valor"}
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)]"
        >
          Redefinir referência
        </button>
      </div>
    </div>
  );
}
