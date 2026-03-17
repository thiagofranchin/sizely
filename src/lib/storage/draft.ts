import { DRAFT_STORAGE_KEY } from "@/lib/constants/storage";
import type { ImageDraft } from "@/lib/types/measurement";

const DRAFT_EVENT = "sizely-draft-updated";

let cachedDraftRaw: string | null = null;
let cachedDraftSnapshot: ImageDraft | null = null;

function notifyDraftChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(DRAFT_EVENT));
}

export function saveDraft(draft: ImageDraft) {
  if (typeof window === "undefined") {
    return;
  }

  const nextRaw = JSON.stringify(draft);
  sessionStorage.setItem(DRAFT_STORAGE_KEY, nextRaw);
  cachedDraftRaw = nextRaw;
  cachedDraftSnapshot = draft;
  notifyDraftChange();
}

export function readDraft() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = sessionStorage.getItem(DRAFT_STORAGE_KEY);

  if (!rawValue) {
    cachedDraftRaw = null;
    cachedDraftSnapshot = null;
    return null;
  }

  if (rawValue === cachedDraftRaw) {
    return cachedDraftSnapshot;
  }

  try {
    const parsed = JSON.parse(rawValue) as ImageDraft;
    cachedDraftRaw = rawValue;
    cachedDraftSnapshot = parsed;
    return parsed;
  } catch {
    cachedDraftRaw = null;
    cachedDraftSnapshot = null;
    return null;
  }
}

export function clearDraft() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  cachedDraftRaw = null;
  cachedDraftSnapshot = null;
  notifyDraftChange();
}

export function subscribeDraft(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => callback();
  window.addEventListener(DRAFT_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(DRAFT_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
