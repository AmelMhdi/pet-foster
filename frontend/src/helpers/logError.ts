export const logError = (message: string, error: unknown) => {
  if (import.meta.env.MODE === "development") {
    console.error(`[DEV] ${message}`, error);
  }
};