export function getFriendlyErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const e = error as { status?: number; message?: string };
  const status = e?.status;
  const message = (e?.message ?? "").toLowerCase();

  if (status === 402) {
    return "You are out of credits for this action. Top up and try again.";
  }
  if (status === 401) {
    return "Your session expired. Please sign in again.";
  }
  if (status === 404) {
    return "We couldn't find what you requested.";
  }
  if (status && status >= 500) {
    return "Server is having trouble right now. Please try again in a moment.";
  }

  if (
    message.includes("failed to fetch") ||
    message.includes("network") ||
    message.includes("fetch failed") ||
    message.includes("enotfound")
  ) {
    return "Network issue detected. Check your connection and retry.";
  }

  if (message.includes("timeout") || message.includes("timed out")) {
    return "This request took too long. Please retry.";
  }

  return e?.message?.trim() ? e.message : fallback;
}
