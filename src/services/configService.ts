import { SiteConfig } from "../types";

export const API_URL = "/api/config";

export async function fetchConfig(): Promise<SiteConfig> {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch config");
  return response.json();
}

export async function saveConfig(config: SiteConfig): Promise<void> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!response.ok) throw new Error("Failed to save config");
}
