import { DRAFT_STORAGE_KEY } from "@/lib/constants/storage";
import type { ImageDraft } from "@/lib/types/measurement";

export function saveDraft(draft: ImageDraft) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function readDraft() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = sessionStorage.getItem(DRAFT_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as ImageDraft;
  } catch {
    return null;
  }
}

export function clearDraft() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(DRAFT_STORAGE_KEY);
}
