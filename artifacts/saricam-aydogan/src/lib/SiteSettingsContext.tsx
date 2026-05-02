import { createContext, useEffect, useState, ReactNode } from "react";
import { getSiteSettings } from "./data";
import { mockSiteSettings, SiteSettings } from "./mockData";

export const SiteSettingsCtx = createContext<SiteSettings>(mockSiteSettings);

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
