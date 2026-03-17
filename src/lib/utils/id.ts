export function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `sizely-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
