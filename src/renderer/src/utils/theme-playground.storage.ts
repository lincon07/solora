import { PlaygroundTheme } from "./types/theme/theme-playground";

const KEY = "soloras:user-theme";

export function loadUserTheme(): PlaygroundTheme | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUserTheme(theme: PlaygroundTheme) {
  localStorage.setItem(KEY, JSON.stringify(theme));
}
