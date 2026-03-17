import { HISTORY_STORAGE_KEY } from "@/lib/constants/storage";
import type { HistoryItem } from "@/lib/types/measurement";

const HISTORY_EVENT = "sizely-history-updated";

function isHistoryArray(value: unknown): value is HistoryItem[] {
  return Array.isArray(value);
}

function notifyHistoryChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(HISTORY_EVENT));
}

export function readHistory() {
  if (typeof window === "undefined") {
    return [] as HistoryItem[];
  }

  const rawValue = localStorage.getItem(HISTORY_STORAGE_KEY);

  if (!rawValue) {
    return [] as HistoryItem[];
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    return isHistoryArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeHistory(items: HistoryItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
  notifyHistoryChange();
}

export function appendHistoryItem(item: HistoryItem) {
  const currentItems = readHistory();
  writeHistory([item, ...currentItems]);
}

export function removeHistoryItem(itemId: string) {
  const nextItems = readHistory().filter((item) => item.id !== itemId);
  writeHistory(nextItems);
}

export function subscribeHistory(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => callback();
  window.addEventListener(HISTORY_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(HISTORY_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
