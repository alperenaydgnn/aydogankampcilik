import { useContext } from "react";
import { SiteSettingsCtx } from "./SiteSettingsContext";
import type { SiteSettings } from "./mockData";

export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsCtx);
}
