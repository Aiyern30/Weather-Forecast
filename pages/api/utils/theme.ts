// utils/theme.ts

export const saveThemeToLocalStorage = (theme: string): void => {
  localStorage.setItem("colorTheme", theme);
};

export const loadThemeFromLocalStorage = (): string => {
  return localStorage.getItem("colorTheme") || "default-theme"; // Provide a default theme if none is saved
};

export const applyTheme = (theme: string): void => {
  document.documentElement.className = theme; // Apply theme class to the root element
};
