import type { LinePoints, Point } from "@/lib/types/measurement";

export function calculateDistanceInPixels(start: Point, end: Point) {
  return Math.hypot(end.x - start.x, end.y - start.y);
}

export function calculateScaleCmPerPixel(
  referenceSizeCm: number,
  referenceDistancePixels: number,
) {
  if (referenceSizeCm <= 0 || referenceDistancePixels <= 0) {
    return null;
  }

  return referenceSizeCm / referenceDistancePixels;
}

export function convertPixelsToCentimeters(
  distancePixels: number,
  scaleCmPerPixel: number,
) {
  return distancePixels * scaleCmPerPixel;
}

export function pointsAreValid(points: LinePoints): points is [Point, Point] {
  return Boolean(points[0] && points[1]);
}

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
