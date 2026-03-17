export type GarmentTypeId =
  | "shirt"
  | "hoodie"
  | "pants"
  | "shorts"
  | "dress";

export type SourceKind = "camera" | "upload";

export type Point = {
  x: number;
  y: number;
};

export type LinePoints = [Point | null, Point | null];

export type MeasurementDefinition = {
  id: string;
  label: string;
  instruction: string;
  optional?: boolean;
};

export type GarmentTypeDefinition = {
  id: GarmentTypeId;
  label: string;
  description: string;
  measurements: MeasurementDefinition[];
};

export type Reference = {
  points: LinePoints;
  realSizeCm: number | null;
  scaleCmPerPixel: number | null;
};

export type MeasurementEntry = {
  id: string;
  label: string;
  instruction: string;
  optional?: boolean;
  points: LinePoints;
  valueCm: number | null;
  skipped?: boolean;
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
  optional?: boolean;
  skipped?: boolean;
};

export type MeasurementResult = {
  garmentTypeId: GarmentTypeId;
  garmentTypeLabel: string;
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
