export function extractErrorMessage(err) {
    if (err.name === "SequelizeUniqueConstraintError") {
        // Check if the unique constraint is on the full name
        const field = err?.fields;
        const isFullNameDuplicate = err?.original?.sqlMessage?.includes("unique_full_name");

        if (isFullNameDuplicate) {
            return `A donor with the same full name (${Object.values(field).join(" ")}) already exists. You can now login using your registered credentials for this account.`;
        }

        // For other unique fields (like email)
        return "A record with the same value already exists.";
    }

    // Fallback for other errors
    return typeof err === "object" && err?.message
        ? err.message
        : String(err ?? "Unknown error");
}