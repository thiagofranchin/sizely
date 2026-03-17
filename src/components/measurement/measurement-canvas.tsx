"use client";

import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Plus, Ruler, Type, ZoomIn, ZoomOut } from "lucide-react";
import { clampNumber } from "@/lib/measurement/math";
import type { Point } from "@/lib/types/measurement";

export type MeasurementCanvasLine = {
  id: string;
  label: string;
  overlayValue?: string;
  color: string;
  points: [Point | null, Point | null];
  active?: boolean;
};

type MeasurementCanvasProps = {
  imageSrc: string;
  imageAlt: string;
  lines: MeasurementCanvasLine[];
  activeLineId: string;
  onPlacePoint: (lineId: string, point: Point) => void;
  onUpdatePoint: (lineId: string, pointIndex: 0 | 1, point: Point) => void;
  onAddMeasurement?: () => void;
  addMeasurementLabel?: string;
};

type DragState =
  | {
      kind: "point";
      lineId: string;
      pointIndex: 0 | 1;
    }
  | {
      kind: "pan";
      startX: number;
      startY: number;
      originOffsetX: number;
      originOffsetY: number;
    }
  | null;

type Viewport = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

type PointerPreview = {
  screenX: number;
  screenY: number;
  imagePoint: Point;
};

const POINT_HIT_RADIUS = 22;
const MAX_SCALE = 6;

function ToolbarIconButton({
  onClick,
  label,
  active = false,
  neutralActive = false,
  children,
}: {
  onClick: () => void;
  label: string;
  active?: boolean;
  neutralActive?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-300 ease-out ${
        active
          ? neutralActive
            ? "border-[var(--border-soft)] bg-white/85 text-[var(--text-strong)] shadow-sm dark:bg-card/90"
            : "border-primary/40 bg-primary text-primary-foreground shadow-sm"
          : "border-[var(--border-soft)] bg-[var(--surface-alt)] text-[var(--text-strong)] hover:border-primary/30 hover:bg-white/80 dark:hover:bg-card/90"
      }`}
    >
      {children}
    </button>
  );
}

function drawCrossMarker(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  context.save();
  context.strokeStyle = color;
  context.lineWidth = 2.5;
  context.beginPath();
  context.moveTo(x - size, y - size);
  context.lineTo(x + size, y + size);
  context.moveTo(x + size, y - size);
  context.lineTo(x - size, y + size);
  context.stroke();
  context.restore();
}

function drawZoomLens(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  activeViewport: Viewport,
  preview: PointerPreview,
  surfaceWidth: number,
) {
  const lensRadius = 44;
  const lensX = surfaceWidth - lensRadius - 16;
  const lensY = lensRadius + 16;
  const sourceHalfSize = 24 / activeViewport.scale;

  context.save();
  context.beginPath();
  context.arc(lensX, lensY, lensRadius, 0, Math.PI * 2);
  context.clip();
  context.drawImage(
    image,
    clampNumber(preview.imagePoint.x - sourceHalfSize, 0, image.width - sourceHalfSize * 2),
    clampNumber(preview.imagePoint.y - sourceHalfSize, 0, image.height - sourceHalfSize * 2),
    sourceHalfSize * 2,
    sourceHalfSize * 2,
    lensX - lensRadius,
    lensY - lensRadius,
    lensRadius * 2,
    lensRadius * 2,
  );
  context.restore();

  context.save();
  context.strokeStyle = "#111827";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(lensX, lensY, lensRadius, 0, Math.PI * 2);
  context.stroke();
  context.beginPath();
  context.moveTo(lensX - 14, lensY);
  context.lineTo(lensX + 14, lensY);
  context.moveTo(lensX, lensY - 14);
  context.lineTo(lensX, lensY + 14);
  context.stroke();
  context.restore();
}

export function MeasurementCanvas({
  imageSrc,
  imageAlt,
  lines,
  activeLineId,
  onPlacePoint,
  onUpdatePoint,
  onAddMeasurement,
  addMeasurementLabel = "Adicionar medida",
}: MeasurementCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const viewportRef = useRef<Viewport | null>(null);
  const [viewport, setViewport] = useState<Viewport | null>(null);
  const [toolMode, setToolMode] = useState<"mark" | "move">("mark");
  const [dragState, setDragState] = useState<DragState>(null);
  const [surfaceSize, setSurfaceSize] = useState({ width: 0, height: 0 });
  const [pointerPreview, setPointerPreview] = useState<PointerPreview | null>(null);
  const [overlayMode, setOverlayMode] = useState<"label" | "value">("label");

  const imageToScreen = (point: Point, activeViewport: Viewport) => ({
    x: point.x * activeViewport.scale + activeViewport.offsetX,
    y: point.y * activeViewport.scale + activeViewport.offsetY,
  });

  const getFitScale = () => {
    const image = imageRef.current;

    if (!image || !surfaceSize.width || !surfaceSize.height) {
      return 1;
    }

    return Math.min(surfaceSize.width / image.width, surfaceSize.height / image.height);
  };

  const normalizeViewport = (nextViewport: Viewport) => {
    const image = imageRef.current;

    if (!image || !surfaceSize.width || !surfaceSize.height) {
      return nextViewport;
    }

    const renderedWidth = image.width * nextViewport.scale;
    const renderedHeight = image.height * nextViewport.scale;

    const offsetX =
      renderedWidth <= surfaceSize.width
        ? (surfaceSize.width - renderedWidth) / 2
        : clampNumber(nextViewport.offsetX, surfaceSize.width - renderedWidth, 0);
    const offsetY =
      renderedHeight <= surfaceSize.height
        ? (surfaceSize.height - renderedHeight) / 2
        : clampNumber(nextViewport.offsetY, surfaceSize.height - renderedHeight, 0);

    return {
      ...nextViewport,
      offsetX,
      offsetY,
    };
  };

  useEffect(() => {
    const image = new window.Image();
    image.onload = () => {
      imageRef.current = image;
      setViewport(null);
      viewportRef.current = null;
    };
    image.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      setSurfaceSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const image = imageRef.current;

    if (!image || !surfaceSize.width || !surfaceSize.height || viewportRef.current) {
      return;
    }

    const fitScale = getFitScale();
    const nextViewport = normalizeViewport({
      scale: fitScale,
      offsetX: (surfaceSize.width - image.width * fitScale) / 2,
      offsetY: (surfaceSize.height - image.height * fitScale) / 2,
    });

    viewportRef.current = nextViewport;
    setViewport(nextViewport);
  }, [surfaceSize.width, surfaceSize.height, imageSrc]);

  useEffect(() => {
    const activeViewport = viewportRef.current;

    if (!activeViewport) {
      return;
    }

    const nextViewport = normalizeViewport(activeViewport);

    if (
      nextViewport.offsetX !== activeViewport.offsetX ||
      nextViewport.offsetY !== activeViewport.offsetY
    ) {
      viewportRef.current = nextViewport;
      setViewport(nextViewport);
    }
  }, [surfaceSize.height, surfaceSize.width]);

  useEffect(() => {
    viewportRef.current = viewport;
  }, [viewport]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image || !viewport || !surfaceSize.width || !surfaceSize.height) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const ratio = window.devicePixelRatio || 1;
    canvas.width = surfaceSize.width * ratio;
    canvas.height = surfaceSize.height * ratio;
    canvas.style.width = `${surfaceSize.width}px`;
    canvas.style.height = `${surfaceSize.height}px`;

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, surfaceSize.width, surfaceSize.height);

    context.fillStyle = "#f7f7f4";
    context.fillRect(0, 0, surfaceSize.width, surfaceSize.height);
    context.drawImage(
      image,
      viewport.offsetX,
      viewport.offsetY,
      image.width * viewport.scale,
      image.height * viewport.scale,
    );

    for (const line of lines) {
      const [start, end] = line.points;

      if (start && end) {
        const startScreen = imageToScreen(start, viewport);
        const endScreen = imageToScreen(end, viewport);
        context.strokeStyle = line.active ? "#0f766e" : line.color;
        context.lineWidth = line.active ? 3 : 2;
        context.beginPath();
        context.moveTo(startScreen.x, startScreen.y);
        context.lineTo(endScreen.x, endScreen.y);
        context.stroke();

        const overlayText =
          overlayMode === "value" && line.overlayValue ? line.overlayValue : line.label;
        const midX = (startScreen.x + endScreen.x) / 2;
        const midY = (startScreen.y + endScreen.y) / 2;
        context.font = "12px sans-serif";
        const textWidth = context.measureText(overlayText).width;
        const pillWidth = Math.max(78, textWidth + 22);
        context.fillStyle = "rgba(10, 16, 18, 0.9)";
        context.fillRect(midX - pillWidth / 2, midY - 28, pillWidth, 22);
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.fillText(overlayText, midX, midY - 12);
      }

      for (const point of line.points) {
        if (!point) {
          continue;
        }

        const screenPoint = imageToScreen(point, viewport);
        context.strokeStyle = line.active ? "#0f766e" : line.color;
        context.lineWidth = 3;
        drawCrossMarker(context, screenPoint.x, screenPoint.y, 9, line.active ? "#0f766e" : line.color);
      }
    }

    if (toolMode === "mark" && pointerPreview) {
      drawCrossMarker(context, pointerPreview.screenX, pointerPreview.screenY, 10, "#111827");
      drawZoomLens(context, image, viewport, pointerPreview, surfaceSize.width);
    }
  }, [lines, overlayMode, pointerPreview, surfaceSize.height, surfaceSize.width, toolMode, viewport]);

  function screenToImage(clientX: number, clientY: number) {
    const container = containerRef.current;
    const activeViewport = viewportRef.current;

    if (!container || !activeViewport) {
      return null;
    }

    const bounds = container.getBoundingClientRect();
    const image = imageRef.current;

    if (!image) {
      return null;
    }

    return {
      x: clampNumber(
        (clientX - bounds.left - activeViewport.offsetX) / activeViewport.scale,
        0,
        image.width,
      ),
      y: clampNumber(
        (clientY - bounds.top - activeViewport.offsetY) / activeViewport.scale,
        0,
        image.height,
      ),
    };
  }

  function findClosestPoint(clientX: number, clientY: number) {
    const activeViewport = viewportRef.current;

    if (!activeViewport) {
      return null;
    }

    let closestPoint:
      | {
          lineId: string;
          pointIndex: 0 | 1;
          distance: number;
        }
      | null = null;

    for (const line of lines) {
      for (const [index, point] of line.points.entries()) {
        if (!point) {
          continue;
        }

        const pointIndex = index as 0 | 1;
        const screenPoint = imageToScreen(point, activeViewport);
        const distance = Math.hypot(screenPoint.x - clientX, screenPoint.y - clientY);

        if (distance <= POINT_HIT_RADIUS && (!closestPoint || distance < closestPoint.distance)) {
          closestPoint = {
            lineId: line.id,
            pointIndex,
            distance,
          };
        }
      }
    }

    return closestPoint;
  }

  function updateViewport(nextViewport: Viewport) {
    const normalizedViewport = normalizeViewport(nextViewport);
    viewportRef.current = normalizedViewport;
    setViewport(normalizedViewport);
  }

  function zoomBy(multiplier: number) {
    const image = imageRef.current;
    const activeViewport = viewportRef.current;

    if (!image || !activeViewport) {
      return;
    }

    const centerX = surfaceSize.width / 2;
    const centerY = surfaceSize.height / 2;
    const imagePoint = {
      x: (centerX - activeViewport.offsetX) / activeViewport.scale,
      y: (centerY - activeViewport.offsetY) / activeViewport.scale,
    };
    const nextScale = clampNumber(activeViewport.scale * multiplier, getFitScale(), MAX_SCALE);
    setDragState(null);
    setPointerPreview(null);
    updateViewport({
      scale: nextScale,
      offsetX: centerX - imagePoint.x * nextScale,
      offsetY: centerY - imagePoint.y * nextScale,
    });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    const container = containerRef.current;
    const activeViewport = viewportRef.current;

    if (!container || !activeViewport) {
      return;
    }

    const bounds = container.getBoundingClientRect();
    const localX = event.clientX - bounds.left;
    const localY = event.clientY - bounds.top;
    const closestPoint = findClosestPoint(localX, localY);

    if (closestPoint) {
      setDragState({
        kind: "point",
        lineId: closestPoint.lineId,
        pointIndex: closestPoint.pointIndex,
      });
      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }

    if (toolMode === "move") {
      setDragState({
        kind: "pan",
        startX: event.clientX,
        startY: event.clientY,
        originOffsetX: activeViewport.offsetX,
        originOffsetY: activeViewport.offsetY,
      });
      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }

    const point = screenToImage(event.clientX, event.clientY);

    if (point) {
      setPointerPreview({
        screenX: localX,
        screenY: localY,
        imagePoint: point,
      });
      onPlacePoint(activeLineId, point);
    }
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    const activeViewport = viewportRef.current;
    const container = containerRef.current;

    if (!activeViewport || !container) {
      return;
    }

    const bounds = container.getBoundingClientRect();
    const localX = event.clientX - bounds.left;
    const localY = event.clientY - bounds.top;
    const hoveredPoint = screenToImage(event.clientX, event.clientY);

    if (hoveredPoint) {
      setPointerPreview({
        screenX: localX,
        screenY: localY,
        imagePoint: hoveredPoint,
      });
    }

    if (!dragState) {
      return;
    }

    if (dragState.kind === "pan") {
      updateViewport({
        ...activeViewport,
        offsetX: dragState.originOffsetX + (event.clientX - dragState.startX),
        offsetY: dragState.originOffsetY + (event.clientY - dragState.startY),
      });
      return;
    }

    const point = screenToImage(event.clientX, event.clientY);

    if (point) {
      onUpdatePoint(dragState.lineId, dragState.pointIndex, point);
    }
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDragState(null);
  }

  function handlePointerLeave() {
    setPointerPreview(null);
  }

  return (
    <div className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-alt)] p-1">
          <button
            type="button"
            onClick={() => setToolMode("mark")}
            className={`min-h-10 rounded-xl px-4 text-sm font-medium transition-all duration-300 ease-out ${
              toolMode === "mark"
                ? "bg-[var(--text-strong)] text-[var(--surface-strong)] shadow-sm dark:bg-primary dark:text-primary-foreground"
                : "text-[var(--text-soft)]"
            }`}
          >
            Marcar
          </button>
          <button
            type="button"
            onClick={() => setToolMode("move")}
            className={`min-h-10 rounded-xl px-4 text-sm font-medium transition-all duration-300 ease-out ${
              toolMode === "move"
                ? "bg-[var(--text-strong)] text-[var(--surface-strong)] shadow-sm dark:bg-primary dark:text-primary-foreground"
                : "text-[var(--text-soft)]"
            }`}
          >
            Mover
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-[1.35rem] border border-[var(--border-soft)] bg-[var(--surface-alt)] p-1.5">
          <ToolbarIconButton onClick={() => zoomBy(1.12)} label="Aumentar zoom">
            <ZoomIn className="size-4" />
          </ToolbarIconButton>
          <ToolbarIconButton onClick={() => zoomBy(0.88)} label="Reduzir zoom">
            <ZoomOut className="size-4" />
          </ToolbarIconButton>
          <ToolbarIconButton
            onClick={() =>
              setOverlayMode((currentMode) => (currentMode === "label" ? "value" : "label"))
            }
            label={
              overlayMode === "label"
                ? "Mostrar medidas nas linhas"
                : "Mostrar nomes nas linhas"
            }
            active={overlayMode === "label"}
            neutralActive
          >
            {overlayMode === "label" ? (
              <Ruler className="size-4" />
            ) : (
              <Type className="size-4" />
            )}
          </ToolbarIconButton>
          {onAddMeasurement ? (
            <ToolbarIconButton onClick={onAddMeasurement} label={addMeasurementLabel}>
              <Plus className="size-5" />
            </ToolbarIconButton>
          ) : null}
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-[58vh] min-h-[340px] overflow-hidden rounded-[24px] bg-[#f7f7f4] md:h-[68vh]"
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={imageAlt}
          className="h-full w-full touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        />
      </div>

      <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
        Use o modo marcar para tocar os pontos. Use o modo mover para arrastar a imagem.
        Pontos já marcados podem ser reposicionados arrastando diretamente sobre eles.
      </p>
    </div>
  );
}
