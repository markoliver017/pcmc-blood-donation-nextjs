export function extractErrorMessage(err) {
    return typeof err === "object" && err?.message
        ? err.message
        : String(err ?? "Unknown error");
}
