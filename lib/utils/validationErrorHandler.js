/**
 * Unified error handling utility that combines validation error handling and message extraction
 * @param {Error} error - The Sequelize error object
 * @param {Object} options - Options for error handling
 * @param {boolean} options.returnString - If true, returns a simple string message instead of structured object
 * @returns {Object|string} - Formatted error response or string message
 */
export const handleValidationError = (error, options = {}) => {
    const { returnString = false } = options;

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => ({
            field: err.path,
            message: err.message,
            value: err.value,
        }));

        if (returnString) {
            return errors.length > 0 ? errors[0].message : "Validation failed";
        }

        return {
            success: false,
            message: "Validation failed",
            errors: errors,
        };
    }

    // Handle Sequelize unique constraint errors
    if (error.name === "SequelizeUniqueConstraintError") {
        // Check if the unique constraint is on the full name (donor-specific case)
        const field = error?.fields;
        const isFullNameDuplicate =
            error?.original?.sqlMessage?.includes("unique_full_name");

        if (isFullNameDuplicate) {
            const message = `A donor with the same full name (${Object.values(
                field
            ).join(
                " "
            )}) already exists. You can now login using your registered credentials for this account. Thank you!`;

            if (returnString) {
                return message;
            }

            return {
                success: false,
                message: message,
                errors: [
                    {
                        field: "full_name",
                        message: message,
                        value: null,
                    },
                ],
            };
        }

        // For other unique fields (like email)
        const errors = error.errors.map((err) => ({
            field: err.path,
            message: err.message,
            value: err.value,
        }));

        if (returnString) {
            return "A record with the same value already exists.";
        }

        return {
            success: false,
            message: "Duplicate entry found",
            errors: errors,
        };
    }

    // Handle custom error messages from hooks
    if (error.message && error.message.includes("already exists")) {
        if (returnString) {
            return error.message;
        }

        return {
            success: false,
            message: error.message,
            errors: [
                {
                    field: "name",
                    message: error.message,
                    value: null,
                },
            ],
        };
    }

    // Generic error handling
    const message =
        typeof error === "object" && error?.message
            ? error.message
            : String(error ?? "Unknown error");

    if (returnString) {
        return message;
    }

    return {
        success: false,
        message: message,
        errors: [],
    };
};

/**
 * Legacy function for backward compatibility - returns simple string messages
 * @param {Error} error - The error object
 * @returns {string} - Error message string
 */
export const extractErrorMessage = (error) => {
    return handleValidationError(error, { returnString: true });
};

/**
 * Format validation errors for frontend display
 * @param {Array} errors - Array of validation errors
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const formatValidationErrors = (errors) => {
    const formattedErrors = {};

    errors.forEach((error) => {
        if (error.field) {
            formattedErrors[error.field] = error.message;
        }
    });

    return formattedErrors;
};

/**
 * Enhanced error handler for server actions that provides both structured and string responses
 * @param {Error} error - The error object
 * @param {Object} options - Options for error handling
 * @param {boolean} options.returnString - If true, returns simple string message
 * @param {boolean} options.includeType - If true, includes error type in response
 * @returns {Object|string} - Formatted error response
 */
export const handleServerError = (error, options = {}) => {
    const { returnString = false, includeType = false } = options;

    // Try validation error handler first
    const validationResult = handleValidationError(error, { returnString });

    if (returnString) {
        return validationResult;
    }

    // Add type information if requested
    if (includeType) {
        return {
            ...validationResult,
            type: "server",
        };
    }

    return validationResult;
};
