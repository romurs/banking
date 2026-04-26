import type { LocationQueryValue } from "vue-router";

export const APP_ROOT_PATH = "/app";
export const APP_HOME_PATH = "/app/main";

const APP_PATH_RE = /^\/app(?:\/|$)/;

export function resolveAppRedirect(
  redirect?: LocationQueryValue | LocationQueryValue[],
) {
  const value = Array.isArray(redirect) ? redirect[0] : redirect;

  if (typeof value !== "string" || !APP_PATH_RE.test(value)) {
    return null;
  }

  return value === APP_ROOT_PATH ? APP_HOME_PATH : value;
}
