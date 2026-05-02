import type { UserRole } from "@/types/user";

/**
 * Converts a technical role code into a display-friendly university title.
 * Used for UI components like Profile headers, Admin tables, and Badges.
 */
export const convertRoleToTitle = (role: UserRole): string => {
    switch (role) {
        case "super-admin":
            return "System Administrator";
        case "faculty-admin":
            return "Faculty Administrator";
        case "student-affairs":
            return "Student Affairs Officer";
        case "department-admin":
            return "Departmental Admin / HOD";
        case "event-organiser":
            return "Event Organiser";
        case "staff":
            return "University Staff";
        case "src-exec":
            return "SRC Executive";
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
    return title ? `${title} ${fName} ${lName}` : `${fName} ${lName}`;
};