"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { CopyResultsButton } from "@/components/measurement/copy-results-button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCentimeters, formatDateTime } from "@/lib/measurement/format";
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
          className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
            {(() => {
              const itemTitle =
                "title" in item && typeof item.title === "string"
                  ? item.title
                  : "garmentTypeLabel" in item && typeof item.garmentTypeLabel === "string"
                    ? item.garmentTypeLabel
                    : "Medição";

              return (
                <h2 className="font-[var(--font-space-grotesk)] text-xl font-medium text-[var(--text-strong)]">
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
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="flex min-h-11 items-center justify-center rounded-2xl border border-red-200 px-4 text-sm font-medium text-red-700 transition hover:bg-red-50"
              >
                Excluir item
              </button>
            </div>
          </div>

          <details className="mt-5 rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-alt)] p-4">
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
                    className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--surface)] px-4 py-3"
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
        className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)]"
      >
        Nova medição
      </Link>
    </div>
  );
}
