import manifest from "../config/r2-assets.json";

export function r2Asset(path) {
  if (!path) return path;

  return manifest.assets[path]?.url || path;
}

export const R2_ASSET_BASE_URL = manifest.publicBaseUrl;
