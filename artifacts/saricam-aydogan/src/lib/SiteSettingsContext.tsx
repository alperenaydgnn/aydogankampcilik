import { createContext, useEffect, useState, ReactNode } from "react";
import { getSiteSettings } from "./data";
import { mockSiteSettings, SiteSettings } from "./mockData";

const _g = globalThis as Record<string, unknown>;
if (!_g.__aydogan_settings_ctx__) {
  _g.__aydogan_settings_ctx__ = createContext<SiteSettings>(mockSiteSettings);
}
export const SiteSettingsCtx = _g.__aydogan_settings_ctx__ as ReturnType<typeof createContext<SiteSettings>>;

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(mockSiteSettings);
  useEffect(() => {
    let cancelled = false;
    getSiteSettings().then((s) => {
      if (!cancelled) setSettings({ ...mockSiteSettings, ...s });
    });
    return () => { cancelled = true; };
  }, []);
  return <SiteSettingsCtx.Provider value={settings}>{children}</SiteSettingsCtx.Provider>;
}
