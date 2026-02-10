import { APP_TIMEZONE } from "../config/timezone";

/**
 * Base formatter (internal use)
 */
function format(date, options) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: APP_TIMEZONE,
    ...options,
  }).format(new Date(date));
}

/**
 * 06 Feb 2026
 */
export function formatDate(date) {
  return format(date, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * 06 Feb 2026, 07:11 PM
 */
export function formatDateTime(date) {
  return format(date, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * 07:11 PM
 */
export function formatTime(date) {
  return format(date, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * 06/02/2026
 */
export function formatDateNumeric(date) {
  return format(date, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * ISO-like in APP timezone (for display/debug)
 */
export function formatISOInTZ(date) {
  const d = new Date(date);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(d);

  const map = Object.fromEntries(parts.map(p => [p.type, p.value]));

  return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second}`;
}
