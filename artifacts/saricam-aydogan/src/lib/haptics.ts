/**
 * Tiny haptic feedback wrapper. Uses the Vibration API when available
 * (mostly Android Chrome / mobile Firefox). Silently no-ops elsewhere.
 * Respects user reduced-motion preference.
 */
function reducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function canVibrate(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

export const haptics = {
  light() {
    if (!canVibrate() || reducedMotion()) return;
    try { navigator.vibrate(10); } catch { /* noop */ }
  },
  tap() {
    if (!canVibrate() || reducedMotion()) return;
    try { navigator.vibrate(18); } catch { /* noop */ }
  },
  success() {
    if (!canVibrate() || reducedMotion()) return;
    try { navigator.vibrate([20, 30, 40]); } catch { /* noop */ }
  },
  warn() {
    if (!canVibrate() || reducedMotion()) return;
    try { navigator.vibrate([10, 20, 10, 20, 10]); } catch { /* noop */ }
  },
};
