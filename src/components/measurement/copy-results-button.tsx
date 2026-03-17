"use client";

import { Copy, CopyCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { buildResultsText } from "@/lib/measurement/format";
import type { HistoryItem, MeasurementResult } from "@/lib/types/measurement";

type CopyResultsButtonProps = {
  result: MeasurementResult | HistoryItem;
};

export function CopyResultsButton({ result }: CopyResultsButtonProps) {
  const { copy, copied } = useCopyToClipboard();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => copy(buildResultsText(result))}
      className="h-11 rounded-full bg-white/80 px-4 text-sm dark:bg-card/80"
    >
      {copied ? <CopyCheck className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Texto copiado" : "Copiar resultados"}
    </Button>
  );
}
