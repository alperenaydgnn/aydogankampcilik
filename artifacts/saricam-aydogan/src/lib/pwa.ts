/**
 * PWA helpers — service worker registration, install prompt capture,
 * and Web Push subscription utilities.
 *
 * The install prompt is a single, app-wide deferred event handled by
 * `usePWAInstall`. Push subscription is best-effort: works in browsers
 * with a configured VAPID key (VITE_VAPID_PUBLIC_KEY) and falls back
 * to local notification permission only when the key is missing.
 */
import { useEffect, useState, useCallback } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<() => void>();

export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (import.meta.env.DEV) return; // avoid SW caching in dev (HMR breaks)

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("[pwa] SW registration failed", err);
    });
  });

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    promptListeners.forEach((fn) => fn());
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    promptListeners.forEach((fn) => fn());
    try { localStorage.setItem("pwa.installed", "1"); } catch { /* noop */ }
  });
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // @ts-expect-error iOS Safari
    window.navigator.standalone === true
  );
}

export function isiOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) && !/CriOS|FxiOS/i.test(navigator.userAgent);
}

const PROMPT_DISMISS_KEY = "pwa.installDismissedAt";
const DISMISS_DAYS = 7;

export function usePWAInstall() {
  const [available, setAvailable] = useState<boolean>(!!deferredPrompt);
  const [installed, setInstalled] = useState<boolean>(isStandalone());

  useEffect(() => {
    const onChange = () => {
      setAvailable(!!deferredPrompt);
      setInstalled(isStandalone());
    };
    promptListeners.add(onChange);
    onChange();
    return () => { promptListeners.delete(onChange); };
  }, []);

  const promptInstall = useCallback(async (): Promise<"accepted" | "dismissed" | "unavailable"> => {
    if (!deferredPrompt) return "unavailable";
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      promptListeners.forEach((fn) => fn());
      return choice.outcome;
    } catch {
      return "dismissed";
    }
  }, []);

  const dismissedRecently = (() => {
    try {
      const v = localStorage.getItem(PROMPT_DISMISS_KEY);
      if (!v) return false;
      const ts = Number(v);
      if (!Number.isFinite(ts)) return false;
      return Date.now() - ts < DISMISS_DAYS * 86400_000;
    } catch { return false; }
  })();

  const remember = useCallback(() => {
    try { localStorage.setItem(PROMPT_DISMISS_KEY, String(Date.now())); } catch { /* noop */ }
  }, []);

  return { available, installed, promptInstall, dismissedRecently, remember, isiOS: isiOS() };
}

/* ── Web Push ─────────────────────────────────────────── */

const PUSH_KEY = "push.subscribed";

export type PushState = "unsupported" | "default" | "granted" | "denied" | "subscribed";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) out[i] = raw.charCodeAt(i);
  return out;
}

export async function getPushState(): Promise<PushState> {
  if (typeof window === "undefined") return "unsupported";
  if (!("Notification" in window) || !("serviceWorker" in navigator)) return "unsupported";
  const perm = Notification.permission;
  if (perm === "denied") return "denied";
  if (perm === "default") return "default";
  // granted — check subscription
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager?.getSubscription?.();
    if (sub || localStorage.getItem(PUSH_KEY) === "1") return "subscribed";
  } catch { /* noop */ }
  return "granted";
}

export async function subscribePush(): Promise<PushState> {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) return "unsupported";

  let perm = Notification.permission;
  if (perm === "default") perm = await Notification.requestPermission();
  if (perm !== "granted") return perm === "denied" ? "denied" : "default";

  try {
    const reg = await navigator.serviceWorker.ready;
    const vapid = (import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined) || "";
    if (vapid && reg.pushManager) {
      const existing = await reg.pushManager.getSubscription();
      const sub =
        existing ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapid).buffer as ArrayBuffer,
        }));
      // Best-effort POST to backend — silently ignore if endpoint absent
      try {
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(sub),
        });
      } catch { /* noop */ }
    }
    try { localStorage.setItem(PUSH_KEY, "1"); } catch { /* noop */ }
    // Fire a welcome notification so the user sees confirmation
    await reg.showNotification("Sarıçam Aydoğan", {
      body: "Bildirimler açıldı. Yeni ürün, kampanya ve stok haberlerini ileteceğiz.",
      icon: "/icons/icon-192.svg",
      badge: "/icons/icon-192.svg",
      tag: "saricam-welcome",
    });
    return "subscribed";
  } catch (err) {
    console.warn("[pwa] subscribe failed", err);
    return perm;
  }
}

export async function unsubscribePush(): Promise<void> {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager?.getSubscription?.();
    if (sub) await sub.unsubscribe();
  } catch { /* noop */ }
  try { localStorage.removeItem(PUSH_KEY); } catch { /* noop */ }
}
