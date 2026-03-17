"use client";

import { useEffect, useRef, useState } from "react";
import { Crosshair, RefreshCcw, Ruler } from "lucide-react";
import { MeasurementCanvas, type MeasurementCanvasLine } from "@/components/measurement/measurement-canvas";
import { InstructionBox } from "@/components/ui/instruction-box";
import { Button } from "@/components/ui/button";
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
  const focusTimeoutRef = useRef<number | null>(null);
  const pulseTimeoutRef = useRef<number | null>(null);
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
    if (focusTimeoutRef.current) {
      window.clearTimeout(focusTimeoutRef.current);
      focusTimeoutRef.current = null;
    }

    if (pulseTimeoutRef.current) {
      window.clearTimeout(pulseTimeoutRef.current);
      pulseTimeoutRef.current = null;
    }

    if (!pointsAreValid(points) || referenceSizeCm) {
      return;
    }

    const input = inputRef.current;

    if (!input) {
      return;
    }

    focusTimeoutRef.current = window.setTimeout(() => {
      input.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      input.focus();
      setShouldPulse(true);
      pulseTimeoutRef.current = window.setTimeout(() => {
        setShouldPulse(false);
        pulseTimeoutRef.current = null;
      }, 1200);
      focusTimeoutRef.current = null;
    }, 4000);

    return () => {
      if (focusTimeoutRef.current) {
        window.clearTimeout(focusTimeoutRef.current);
        focusTimeoutRef.current = null;
      }

      if (pulseTimeoutRef.current) {
        window.clearTimeout(pulseTimeoutRef.current);
        pulseTimeoutRef.current = null;
      }
    };
  }, [points, referenceSizeCm]);

  return (
    <div className="grid gap-5">
      <InstructionBox
        title="Calibração"
        description="Use um objeto real visível na foto, marque as duas extremidades e informe o valor em centímetros para definir a escala."
      />

      <MeasurementCanvas
        imageSrc={imageSrc}
        imageAlt="Imagem carregada para calibração"
        lines={lines}
        activeLineId="reference"
        onPlacePoint={onPlacePoint}
        onUpdatePoint={onUpdatePoint}
      />

      <div className="luxury-panel grid gap-4 p-5 sm:p-6">
        <label className="grid gap-2">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-strong)]">
            <Ruler className="size-4 text-primary" />
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
            className={`min-h-12 rounded-[1.3rem] border bg-white/90 px-4 text-base text-slate-900 outline-none transition focus:border-primary dark:bg-card/90 dark:text-foreground ${
              shouldPulse
                ? "border-primary shadow-[0_0_0_5px_rgba(233,194,148,0.4)]"
                : "border-[var(--border-soft)]"
            }`}
          />
        </label>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.35rem] border border-[var(--border-soft)] bg-[color:var(--surface-alt)] px-4 py-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Distância
            </p>
            <p className="mt-1 text-sm text-[var(--text-strong)]">
            Distância na imagem:{" "}
            {referenceDistance ? `${referenceDistance.toFixed(1).replace(".", ",")} px` : "Aguardando marcação"}
            </p>
          </div>
          <div className="rounded-[1.35rem] border border-[var(--border-soft)] bg-[color:var(--surface-alt)] px-4 py-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Escala
            </p>
            <p className="mt-1 text-sm text-[var(--text-strong)]">
            {scaleCmPerPixel ? `${scaleCmPerPixel.toFixed(4).replace(".", ",")} cm/px` : "Aguardando dados válidos"}
            </p>
          </div>
          <div className="rounded-[1.35rem] border border-[var(--border-soft)] bg-[color:var(--surface-alt)] px-4 py-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Referência
            </p>
            <p className="mt-1 text-sm text-[var(--text-strong)]">
            {referenceSizeCm ? formatCentimeters(Number(referenceSizeCm.replace(",", "."))) : "Aguardando valor"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm text-[var(--text-soft)]">
            <Crosshair className="size-4 text-primary" />
            Ajuste os pontos se precisar refinar a referência.
          </div>
          <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="h-11 rounded-full bg-white/80 px-4 text-sm dark:bg-card/80"
        >
          <RefreshCcw className="size-4" />
          Redefinir referência
          </Button>
        </div>
      </div>
    </div>
  );
}
