import type {
  GarmentTypeDefinition,
  GarmentTypeId,
  MeasurementEntry,
  MeasurementDefinition,
} from "@/lib/types/measurement";

const shirtMeasurements: MeasurementDefinition[] = [
  {
    id: "chest-width",
    label: "Largura do peito",
    instruction: "Toque nas duas extremidades do peito, de lateral a lateral.",
  },
  {
    id: "total-length",
    label: "Comprimento total",
    instruction: "Marque do ponto mais alto do ombro até a barra inferior.",
  },
  {
    id: "sleeve",
    label: "Manga",
    instruction: "Marque do início da manga até a extremidade do punho.",
  },
  {
    id: "shoulder-width",
    label: "Ombro a ombro",
    instruction: "Marque os dois pontos mais externos dos ombros.",
  },
  {
    id: "neck-width",
    label: "Gola (largura)",
    instruction: "Marque a largura frontal da gola, de ponta a ponta.",
  },
];

const hoodieMeasurements: MeasurementDefinition[] = [
  {
    id: "chest-width",
    label: "Largura do peito",
    instruction: "Toque nas laterais do peito, mantendo a linha reta.",
  },
  {
    id: "total-length",
    label: "Comprimento total",
    instruction: "Marque do topo do ombro até a barra do moletom.",
  },
  {
    id: "sleeve",
    label: "Manga",
    instruction: "Marque do ombro até a ponta do punho.",
  },
  {
    id: "shoulder-width",
    label: "Ombro a ombro",
    instruction: "Toque nos dois extremos dos ombros.",
  },
  {
    id: "cuff",
    label: "Punho",
    instruction: "Marque a largura do punho na barra da manga.",
  },
];

const pantsMeasurements: MeasurementDefinition[] = [
  {
    id: "waist",
    label: "Cintura",
    instruction: "Marque a largura da cintura, de lado a lado.",
  },
  {
    id: "hip",
    label: "Quadril",
    instruction: "Marque a largura da região mais larga do quadril.",
  },
  {
    id: "rise",
    label: "Gancho",
    instruction: "Marque da cintura até o ponto de encontro do gancho.",
  },
  {
    id: "inseam",
    label: "Entreperna",
    instruction: "Marque do gancho até a barra pela costura interna.",
  },
  {
    id: "total-length",
    label: "Comprimento total",
    instruction: "Marque da cintura até a barra inferior.",
  },
  {
    id: "leg-opening",
    label: "Barra",
    instruction: "Marque a largura da abertura da barra.",
  },
];

const shortsMeasurements: MeasurementDefinition[] = [
  {
    id: "waist",
    label: "Cintura",
    instruction: "Marque a largura da cintura, de lado a lado.",
  },
  {
    id: "hip",
    label: "Quadril",
    instruction: "Marque a largura da região mais larga do quadril.",
  },
  {
    id: "rise",
    label: "Gancho",
    instruction: "Marque da cintura até o fim do gancho.",
  },
  {
    id: "total-length",
    label: "Comprimento total",
    instruction: "Marque da cintura até a barra da peça.",
  },
  {
    id: "leg-opening",
    label: "Barra",
    instruction: "Marque a largura da abertura da barra.",
  },
];

const dressMeasurements: MeasurementDefinition[] = [
  {
    id: "bust-width",
    label: "Busto / largura superior",
    instruction: "Marque a largura da parte superior do vestido.",
  },
  {
    id: "waist",
    label: "Cintura",
    instruction: "Marque a largura da cintura no ponto mais estreito.",
  },
  {
    id: "hip",
    label: "Quadril",
    instruction: "Marque a largura da região do quadril.",
  },
  {
    id: "total-length",
    label: "Comprimento total",
    instruction: "Marque do topo da peça até a barra inferior.",
  },
  {
    id: "sleeve",
    label: "Manga",
    instruction: "Se houver manga, marque do início até a extremidade.",
    optional: true,
  },
];

export const GARMENT_TYPES: GarmentTypeDefinition[] = [
  {
    id: "shirt",
    label: "Camiseta / Camisa",
    description: "Peças superiores leves ou sociais com foco em peito, manga e ombro.",
    measurements: shirtMeasurements,
  },
  {
    id: "hoodie",
    label: "Moletom",
    description: "Peças superiores com manga longa e destaque para punho e ombros.",
    measurements: hoodieMeasurements,
  },
  {
    id: "pants",
    label: "Calça",
    description: "Peças inferiores longas com cintura, gancho, entreperna e barra.",
    measurements: pantsMeasurements,
  },
  {
    id: "shorts",
    label: "Bermuda / Shorts",
    description: "Peças inferiores curtas com cintura, quadril e abertura de barra.",
    measurements: shortsMeasurements,
  },
  {
    id: "dress",
    label: "Vestido",
    description: "Peças inteiras com busto, cintura, quadril e comprimento total.",
    measurements: dressMeasurements,
  },
];

export function getGarmentDefinition(garmentTypeId: GarmentTypeId) {
  return GARMENT_TYPES.find((item) => item.id === garmentTypeId) ?? GARMENT_TYPES[0];
}

export function buildMeasurementEntries(
  definitions: MeasurementDefinition[],
): MeasurementEntry[] {
  return definitions.map((definition) => ({
    id: definition.id,
    label: definition.label,
    instruction: definition.instruction,
    optional: definition.optional,
    points: [null, null],
    valueCm: null,
    skipped: false,
  }));
}
