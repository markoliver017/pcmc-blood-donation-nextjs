# Unified Error Handling System

This document explains how to use the unified error handling system that consolidates both `extractErrorMessage` and `validationErrorHandler` functionality.

## Overview

The unified error handling system provides three main functions:

1. **`handleValidationError`** - Main function for handling validation errors with structured responses
2. **`extractErrorMessage`** - Legacy function for backward compatibility (returns simple strings)
3. **`handleServerError`** - Enhanced function for server actions with additional options

## Functions

### `handleValidationError(error, options)`

The main function for handling validation errors. It can return either structured objects or simple strings based on the `returnString` option.

**Parameters:**

-   `error` - The Sequelize error object
-   `options` - Optional configuration object
    -   `returnString` (boolean) - If true, returns a simple string message instead of structured object

**Returns:**

-   Structured object (default) or string message

**Example:**

```javascript
import { handleValidationError } from "@lib/utils/validationErrorHandler";

// Structured response (default)
const result = handleValidationError(error);
// Returns: { success: false, message: "...", errors: [...] }

// String response
const message = handleValidationError(error, { returnString: true });
// Returns: "Validation failed"
```

### `extractErrorMessage(error)`

Legacy function for backward compatibility. Returns simple string messages.

**Parameters:**

-   `error` - The error object

**Returns:**

-   String error message

**Example:**

```javascript
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";

const message = extractErrorMessage(error);
// Returns: "A record with the same value already exists."
```

### `handleServerError(error, options)`

Enhanced function specifically for server actions with additional options.

**Parameters:**

-   `error` - The error object
-   `options` - Optional configuration object
    -   `returnString` (boolean) - If true, returns simple string message
    -   `includeType` (boolean) - If true, includes error type in response

**Returns:**

-   Structured object or string message

**Example:**

```javascript
import { handleServerError } from "@lib/utils/validationErrorHandler";

// With type information
const result = handleServerError(error, { includeType: true });
// Returns: { success: false, message: "...", errors: [...], type: "server" }
```

## Server Action Implementation Patterns

### Pattern 1: Simple Error Handling (Backward Compatible)

Use this pattern when you want to maintain existing behavior:

```javascript
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";

export async function simpleAction() {
    try {
        // Your logic here
        return { success: true, data: result };
    } catch (err) {
        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}
```

### Pattern 2: Enhanced Error Handling (Recommended)

Use this pattern for new code or when you want structured error responses:

```javascript
import { handleValidationError } from "@lib/utils/validationErrorHandler";

export async function enhancedAction() {
    try {
        // Your logic here
        return { success: true, data: result };
    } catch (err) {
        const validationResult = handleValidationError(err);
        if (validationResult.success === false) {
            return validationResult;
        }

        // Fallback for non-validation errors
        return {
            success: false,
            message: handleValidationError(err, { returnString: true }),
        };
    }
}
```

### Pattern 3: Server Action with Type Information

Use this pattern when you need to include error type information:

```javascript
import { handleServerError } from "@lib/utils/validationErrorHandler";

export async function serverAction() {
    try {
        // Your logic here
        return { success: true, data: result };
    } catch (err) {
        return handleServerError(err, { includeType: true });
    }
}
```

## Error Response Formats

### Validation Error Response

```javascript
{
    success: false,
    message: "Validation failed",
    errors: [
        {
            field: "name",
            message: "Template name is required",
            value: null
        },
        {
            field: "category",
            message: "Email template category is required",
            value: null
        }
    ]
}
```

### Unique Constraint Error Response

```javascript
{
    success: false,
    message: "A template with name \"Welcome Email\" already exists for category \"AGENCY_REGISTRATION\". Please choose a different name.",
    errors: [
        {
            field: "name",
            message: "A template with name \"Welcome Email\" already exists for category \"AGENCY_REGISTRATION\". Please choose a different name.",
            value: null
        }
    ]
}
```

### Generic Error Response

```javascript
{
    success: false,
    message: "An error occurred",
    errors: []
}
```

### Server Error Response (with type)

```javascript
{
    success: false,
    message: "An error occurred",
    errors: [],
    type: "server"
}
```

## Frontend Integration

### Displaying Validation Errors

Use the `formatValidationErrors` utility to format errors for frontend display:

```javascript
import { formatValidationErrors } from "@lib/utils/validationErrorHandler";

const handleSubmit = async (formData) => {
    const result = await createEmailTemplateAction(formData);

    if (!result.success) {
        if (result.errors) {
            const fieldErrors = formatValidationErrors(result.errors);
            // fieldErrors will be: { name: "Template name is required", category: "..." }
            setErrors(fieldErrors);
        } else {
            setGeneralError(result.message);
        }
    }
};
```

### Example React Component

```jsx
import { useState } from "react";
import { createEmailTemplateAction } from "@/app/action/emailTemplateAction";
import { formatValidationErrors } from "@lib/utils/validationErrorHandler";

export default function EmailTemplateForm() {
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");

    const handleSubmit = async (formData) => {
        setErrors({});
        setGeneralError("");

        const result = await createEmailTemplateAction(formData);

        if (!result.success) {
            if (result.errors) {
                const fieldErrors = formatValidationErrors(result.errors);
                setErrors(fieldErrors);
            } else {
                setGeneralError(result.message);
            }
        } else {
            // Success handling
            console.log("Template created successfully");
        }
    };

    return (
        <form action={handleSubmit}>
            {generalError && (
                <div className="text-red-500 mb-4">{generalError}</div>
            )}

            <div>
                <label htmlFor="name">Template Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                    <span className="text-red-500 text-sm">{errors.name}</span>
                )}
            </div>

            {/* Other form fields... */}
        </form>
    );
}
```

## Migration Guide

### From `extractErrorMessage` to Unified System

**Before:**

```javascript
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";

catch (err) {
    return { success: false, message: extractErrorMessage(err) };
}
```

**After (Option 1 - Keep same behavior):**

```javascript
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";

catch (err) {
    return { success: false, message: extractErrorMessage(err) };
}
```

**After (Option 2 - Enhanced behavior):**

```javascript
import { handleValidationError } from "@lib/utils/validationErrorHandler";

catch (err) {
    const validationResult = handleValidationError(err);
    if (validationResult.success === false) {
        return validationResult;
    }
    return { success: false, message: handleValidationError(err, { returnString: true }) };
}
```

## Benefits

1. **No Duplication**: Single source of truth for error handling logic
2. **Backward Compatibility**: Existing code continues to work without changes
3. **Enhanced Features**: New structured error responses for better frontend integration
4. **Consistent Behavior**: All error handling follows the same patterns
5. **Easy Migration**: Gradual migration path from old to new system

## Special Cases

### Donor Full Name Duplicate

The system handles the special case of donor full name duplicates with a custom message:

```javascript
// When a donor with the same full name already exists
"A donor with the same full name (John Doe) already exists. You can now login using your registered credentials for this account.";
```

### Email Template Duplicates

Custom validation for email template name + category combinations:

```javascript
// When a template with the same name and category already exists
"A template with name \"Welcome Email\" already exists for category \"AGENCY_REGISTRATION\". Please choose a different name.";
```
