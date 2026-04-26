export type ApiRole = "administrator" | "organiser" | "user";

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: ApiRole;
  is_active: boolean;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersistedAuth {
  accessToken: string;
  user: AuthUser;
}

const STORAGE_KEY = "adun_ems_auth";

function storageForRemember(remember: boolean): Storage {
  return remember ? localStorage : sessionStorage;
}

export function saveAuth(persist: PersistedAuth, rememberMe: boolean): void {
  const raw = JSON.stringify(persist);
  const target = storageForRemember(rememberMe);
  const other = rememberMe ? sessionStorage : localStorage;
  other.removeItem(STORAGE_KEY);
  target.setItem(STORAGE_KEY, raw);
}

export function clearStoredAuth(): void {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
}

export function loadStoredAuth(): PersistedAuth | null {
  const raw =
    localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PersistedAuth;
    if (
      typeof parsed.accessToken === "string" &&
      parsed.user &&
      typeof parsed.user.id === "number"
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** Client-side JWT exp check (no signature verification). */
export function isJwtExpired(token: string): boolean {
  try {
    const [, payloadB64] = token.split(".");
    if (!payloadB64) return true;
    const normalized = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(normalized)) as { exp?: number };
    if (typeof json.exp !== "number") return false;
    return json.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export function dashboardPathForRole(role: ApiRole): string {
  switch (role) {
    case "administrator":
      return "/dashboard/admin";
    case "organiser":
      return "/dashboard/event-organiser";
    default:
      return "/dashboard/student";
  }
}
