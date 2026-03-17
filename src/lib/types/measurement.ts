export type SourceKind = "camera" | "upload";

export type Point = {
  x: number;
  y: number;
};

export type LinePoints = [Point | null, Point | null];

export type Reference = {
  points: LinePoints;
  realSizeCm: number | null;
  scaleCmPerPixel: number | null;
};

export type MeasurementEntry = {
  id: string;
  label: string;
  points: LinePoints;
  valueCm: number | null;
};

export type ImageDraft = {
  imageDataUrl: string;
  sourceName: string;
  sourceKind: SourceKind;
  createdAt: string;
};

export type MeasurementResultItem = {
  id: string;
  label: string;
  valueCm: number | null;
};

export type MeasurementResult = {
  title: string;
  createdAt: string;
  sourceName: string;
  sourceKind: SourceKind;
  reference: {
    realSizeCm: number;
    pixelDistance: number;
    scaleCmPerPixel: number;
  };
  measurements: MeasurementResultItem[];
};

export type HistoryItem = MeasurementResult & {
  id: string;
  savedAt: string;
};
