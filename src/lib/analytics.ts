/**
 * Type-safe analytics abstraction for KaamKit.
 *
 * NOTE: This is an internal architecture placeholder.
 * No third-party tracking scripts, cookies, or external servers are involved.
 * Never pass sensitive file contents, text, or personally identifiable information.
 */

export type AnalyticsEventType =
  | "tool_view"
  | "tool_start"
  | "tool_complete"
  | "tool_error"
  | "tool_favorite_toggle"
  | "search_query";

export interface AnalyticsEventPayload {
  toolId?: string;
  category?: string;
  durationMs?: number;
  fileSizeBytes?: number;
  pageCount?: number;
  query?: string;
  errorMessage?: string;
  favorited?: boolean;
}

export function trackEvent(
  eventType: AnalyticsEventType,
  payload: AnalyticsEventPayload = {}
): void {
  // Development-only debugging log. In production, this is a clean no-op.
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug(`[KaamKit Analytics: ${eventType}]`, payload);
  }
}
