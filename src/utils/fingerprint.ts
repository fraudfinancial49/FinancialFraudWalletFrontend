const STORAGE_KEY = "ffs_device_fingerprint";

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `fp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Stable per-browser-install id, persisted in localStorage, sent on every
// /transactions/assess call so honeypot sessions triggered from this device
// attribute to one growing AttackerProfile row instead of merging into a
// single shared "unknown" fingerprint on the backend.
export function getDeviceFingerprint(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const generated = randomId();
    localStorage.setItem(STORAGE_KEY, generated);
    return generated;
  } catch {
    return randomId();
  }
}
