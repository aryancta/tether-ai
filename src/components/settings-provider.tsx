"use client";

import * as React from "react";

export interface ApiKeys {
  gemini: string;
  groq: string;
  region: "IN" | "US" | "Global";
}

const DEFAULTS: ApiKeys = { gemini: "", groq: "", region: "Global" };
const STORAGE_KEY = "tetherai_api_keys";

interface SettingsContextValue {
  keys: ApiKeys;
  setKeys: (k: Partial<ApiKeys>) => void;
  hasAnyKey: boolean;
  reset: () => void;
}

const SettingsContext = React.createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [keys, setState] = React.useState<ApiKeys>(DEFAULTS);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    } catch {}
  }, [keys, hydrated]);

  const value = React.useMemo<SettingsContextValue>(
    () => ({
      keys,
      setKeys: (k) => setState((cur) => ({ ...cur, ...k })),
      hasAnyKey: Boolean(keys.gemini || keys.groq),
      reset: () => setState(DEFAULTS),
    }),
    [keys],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = React.useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
  return ctx;
}

export function buildAuditHeaders(keys: ApiKeys): Record<string, string> {
  const h: Record<string, string> = {};
  if (keys.gemini) h["x-user-gemini-key"] = keys.gemini;
  if (keys.groq) h["x-user-groq-key"] = keys.groq;
  if (keys.region) h["x-user-region"] = keys.region;
  return h;
}
