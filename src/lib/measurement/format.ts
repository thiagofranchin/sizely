import type { HistoryItem, MeasurementResult } from "@/lib/types/measurement";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function formatCentimeters(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "Não medido";
  }

  return `${value.toFixed(1).replace(".", ",")} cm`;
}

export function formatDateTime(value: string) {
  return dateFormatter.format(new Date(value));
}

export function buildResultsText(result: MeasurementResult | HistoryItem) {
  const lines = [
    `Tipo de peça: ${result.garmentTypeLabel}`,
    `Data: ${formatDateTime(result.createdAt)}`,
    "",
    "Medidas:",
  ];

  for (const item of result.measurements) {
    lines.push(`- ${item.label}: ${formatCentimeters(item.valueCm)}`);
  }

  return lines.join("\n");
}
