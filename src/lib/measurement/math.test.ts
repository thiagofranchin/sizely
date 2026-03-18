import { describe, expect, it } from "vitest";
import {
  calculateDistanceInPixels,
  calculateScaleCmPerPixel,
  clampNumber,
  convertPixelsToCentimeters,
  pointsAreValid,
} from "./math";

describe("measurement math", () => {
  it("calculates pixel distance between two points", () => {
    expect(calculateDistanceInPixels({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it("returns null for invalid scale inputs", () => {
    expect(calculateScaleCmPerPixel(0, 100)).toBeNull();
    expect(calculateScaleCmPerPixel(10, 0)).toBeNull();
  });

  it("calculates centimeters per pixel for valid reference values", () => {
    expect(calculateScaleCmPerPixel(10, 200)).toBe(0.05);
  });

  it("converts pixels to centimeters using the current scale", () => {
    expect(convertPixelsToCentimeters(180, 0.05)).toBe(9);
  });

  it("checks whether both points are present", () => {
    expect(pointsAreValid([{ x: 10, y: 20 }, { x: 30, y: 40 }])).toBe(true);
    expect(pointsAreValid([{ x: 10, y: 20 }, null])).toBe(false);
  });

  it("clamps a number within the provided range", () => {
    expect(clampNumber(12, 0, 10)).toBe(10);
    expect(clampNumber(-2, 0, 10)).toBe(0);
    expect(clampNumber(6, 0, 10)).toBe(6);
  });
});
