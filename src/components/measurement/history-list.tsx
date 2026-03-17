"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Archive, Trash2 } from "lucide-react";
import { CopyResultsButton } from "@/components/measurement/copy-results-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatCentimeters, formatDateTime } from "@/lib/measurement/format";
import { cn } from "@/lib/utils";
import { readHistory, removeHistoryItem, subscribeHistory } from "@/lib/storage/history";

const EMPTY_HISTORY: ReturnType<typeof readHistory> = [];

export function HistoryList() {
  const items = useSyncExternalStore(subscribeHistory, readHistory, () => EMPTY_HISTORY);

  function handleDelete(itemId: string) {
    removeHistoryItem(itemId);
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nenhuma medição salva"
        description="Salve resultados no fluxo principal para montar seu histórico local e poder copiar as medidas novamente depois."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="luxury-panel p-5 sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/70 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)] dark:bg-card/80">
                <Archive className="size-3.5 text-primary" />
                Histórico
              </div>
              {(() => {
                const itemTitle =
                  "title" in item && typeof item.title === "string"
                    ? item.title
                    : "garmentTypeLabel" in item && typeof item.garmentTypeLabel === "string"
                      ? item.garmentTypeLabel
                      : "Medição";

                return (
                  <h2 className="text-2xl text-[var(--text-strong)] luxury-title">
                    {itemTitle}
                  </h2>
                );
              })()}
              <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                {formatDateTime(item.createdAt)} · origem {item.sourceName}
              </p>
            </div>
            <div className="grid gap-3 sm:min-w-52">
              <CopyResultsButton result={item} />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDelete(item.id)}
                className="h-11 rounded-full border-red-200 bg-white/80 px-4 text-sm text-red-700 hover:bg-red-50 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-950/60"
              >
                <Trash2 className="size-4" />
                Excluir item
              </Button>
            </div>
          </div>

          <details className="mt-5 rounded-[1.6rem] border border-[var(--border-soft)] bg-[color:var(--surface-alt)] p-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--text-strong)]">
              Ver detalhes
            </summary>
            <div className="mt-4 grid gap-2 text-sm text-[var(--text-soft)]">
              <p>Referência real: {formatCentimeters(item.reference.realSizeCm)}</p>
              <p>
                Escala: {item.reference.scaleCmPerPixel.toFixed(4).replace(".", ",")} cm por
                pixel
              </p>
              <ul className="grid gap-2">
                {item.measurements.map((measurement) => (
                  <li
                    key={measurement.id}
                    className="flex items-center justify-between gap-3 rounded-[1.2rem] bg-white/80 px-4 py-3 dark:bg-card/80"
                  >
                    <span className="text-[var(--text-strong)]">{measurement.label}</span>
                    <span>{formatCentimeters(measurement.valueCm)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </article>
      ))}

      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-12 rounded-full bg-white/80 px-5 text-sm dark:bg-card/80",
        )}
      >
        Nova medição
      </Link>
    </div>
  );
}
