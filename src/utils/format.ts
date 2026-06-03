
import type { UserRole } from "@/types/user";

type TimeUnit = 'minute' | 'hour' | 'day' | 'week';

/**
 * Converts a technical role code into a display-friendly university title.
 * Used for UI components like Profile headers, Admin tables, and Badges.
 */
export const convertRoleToTitle = (role: UserRole): string => {
    switch (role) {
        case "super-admin":
            return "System Administrator";
        case "event-organiser":
            return "Event Organiser";
        case "staff":
            return "University Staff";
        case "student":
            return "Student";
        default:
            // Fallback: Capitalize and remove hyphens (e.g., "guest-user" -> "Guest User")
            // We cast to 'any' because TypeScript thinks this block is unreachable (type 'never')
            const fallback = (role as any) || "Guest";
            return fallback
                .split("-")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
    }
};

/**
 * Formats a user's name for display across the ADUN Event System.
 * Ensures proper capitalization and handles academic titles.
 * * @example formatName("busayo", "josiah") -> "Busayo Josiah"
 * @example formatName("adeyemi", "amadi", "Prof.") -> "Prof. Adeyemi Amadi"
 */
export const formatName = (first_name: string, last_name: string, title?: string): string => {
    const capitalize = (str: string) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

    const fName = capitalize(first_name);
    const lName = capitalize(last_name);

    // If a title exists, prepend it. Otherwise, return just the full name.
    return title ? `${title}. ${fName} ${lName}` : `${fName} ${lName}`;
};

export const capitalizeInitial = (word: string): string => {
    if (!word) return ""; // Handle empty strings
    return word.charAt(0).toUpperCase() + word.slice(1);
};

/**
 * Formats numbers for UI display with locale-aware separators.
 * Returns "0" for invalid inputs to prevent rendering issues.
 */
export const formatNumber = (
    value: number | string,
    options?: Intl.NumberFormatOptions,
    locale: string = "en-US"
): string => {
    const numericValue = typeof value === "number" ? value : Number(value);

    if (!Number.isFinite(numericValue)) return "0";

    return new Intl.NumberFormat(locale, options).format(numericValue);
};


export const formatRole = (role: UserRole): string => {
    switch (role) {
        case "super-admin":
            return "admin"
        default:
            return role
    }
}

export function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })
}

/**
 * Formats a given number of minutes into a human-readable string
 * matching the single largest applicable unit.
 */
export function formatMinutes(totalMinutes: number): string {
  if (totalMinutes === 0) return '0 minutes';
  
  const MINS_IN_HOUR = 60;
  const MINS_IN_DAY = 1440;       // 60 * 24
  const MINS_IN_WEEK = 10080;     // 1440 * 7

  // Type-safe pluralization helper
  const pluralize = (value: number, unit: TimeUnit): string => {
    return `${value} ${unit}${value === 1 ? '' : 's'}`;
  };

  if (totalMinutes >= MINS_IN_WEEK) {
    const weeks = Math.floor(totalMinutes / MINS_IN_WEEK);
    return pluralize(weeks, 'week');
  }

  if (totalMinutes >= MINS_IN_DAY) {
    const days = Math.floor(totalMinutes / MINS_IN_DAY);
    return pluralize(days, 'day');
  }

  if (totalMinutes >= MINS_IN_HOUR) {
    const hours = Math.floor(totalMinutes / MINS_IN_HOUR);
    return pluralize(hours, 'hour');
  }

  return pluralize(totalMinutes, 'minute');
}
