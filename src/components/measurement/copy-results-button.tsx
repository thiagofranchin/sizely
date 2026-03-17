"use client";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { buildResultsText } from "@/lib/measurement/format";
import type { HistoryItem, MeasurementResult } from "@/lib/types/measurement";

type CopyResultsButtonProps = {
  result: MeasurementResult | HistoryItem;
};

export function CopyResultsButton({ result }: CopyResultsButtonProps) {
  const { copy, copied } = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(buildResultsText(result))}
      className="flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)]"
    >
      {copied ? "Texto copiado" : "Copiar resultados"}
    </button>
  );
}
