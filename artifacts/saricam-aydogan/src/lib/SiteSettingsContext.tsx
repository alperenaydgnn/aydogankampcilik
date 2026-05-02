import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSiteSettings } from "./data";
import { mockSiteSettings, SiteSettings } from "./mockData";

const Ctx = createContext<SiteSettings>(mockSiteSettings);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(mockSiteSettings);
  useEffect(() => {
    let cancelled = false;
    getSiteSettings().then((s) => { if (!cancelled) setSettings({ ...mockSiteSettings, ...s }); });
    return () => { cancelled = true; };
  }, []);
  return <Ctx.Provider value={settings}>{children}</Ctx.Provider>;
}

export function useSiteSettings(): SiteSettings {
  return useContext(Ctx);
}
