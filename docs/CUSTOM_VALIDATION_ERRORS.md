# Custom Validation Error Messages

This document explains how custom validation error messages work in the email template system and how to use them effectively.

## Overview

The email template system now includes custom validation error messages that provide user-friendly feedback when validation fails. These messages are defined at both the field level and model level.

## Field-Level Validation

### EmailTemplateModel Validation Rules

The `EmailTemplateModel` includes the following field-level validations:

#### Name Field

-   **Required**: "Template name is required"
-   **Empty Check**: "Template name cannot be empty"
-   **Length**: "Template name must be between 1 and 255 characters"

#### Category Field

-   **Required**: "Email template category is required"
-   **Empty Check**: "Email template category cannot be empty"

#### Subject Field

-   **Required**: "Email subject is required"
-   **Empty Check**: "Email subject cannot be empty"
-   **Length**: "Email subject must be between 1 and 500 characters"

#### HTML Content Field

-   **Required**: "HTML content is required"
-   **Empty Check**: "HTML content cannot be empty"

## Model-Level Validation

### Unique Constraint Validation

The system enforces a unique constraint on the combination of `name` and `category`. This means you cannot have two templates with the same name in the same category.

**Custom Error Message**: `"A template with name "{name}" already exists for category "{category}". Please choose a different name."`

### Database Index

A unique index is created on the database level:

```sql
CREATE UNIQUE INDEX email_templates_name_category_unique
ON email_templates (name, category);
```

## Using Validation Error Handler

### Backend Usage

The `handleValidationError` utility function processes Sequelize errors and returns user-friendly messages:

```javascript
import { handleValidationError } from "@lib/utils/validationErrorHandler";

try {
    const template = await EmailTemplate.create(data);
    return { success: true, data: template };
} catch (err) {
    const validationResult = handleValidationError(err);
    if (validationResult.success === false) {
        return validationResult;
    }
    return { success: false, message: extractErrorMessage(err) };
}
```

### Response Format

The validation error handler returns responses in this format:

```javascript
// Success case
{
    success: true,
    data: template
}

// Validation error case
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

// Unique constraint error case
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

## Testing Validation Errors

### Testing Unique Constraint

1. Create a template with name "Test Template" and category "AGENCY_REGISTRATION"
2. Try to create another template with the same name and category
3. You should see the custom error message about duplicate entries

### Testing Field Validation

1. Try to submit a form with empty required fields
2. Try to submit a form with invalid data (e.g., very long names)
3. Verify that appropriate error messages are displayed

## Best Practices

1. **Always handle validation errors** in your frontend components
2. **Display field-specific errors** next to the relevant form fields
3. **Show general errors** at the top of the form
4. **Clear errors** when the user starts typing or when a new submission is made
5. **Use consistent error styling** across your application

## Migration Notes

If you're updating from an older version:

1. The `unique: true` constraint on the `category` field has been removed
2. A new unique index on `(name, category)` has been added
3. Custom validation hooks have been added for better error handling
4. The `handleValidationError` utility function is now available for consistent error processing

Run the following command to apply the database changes:

```bash
npx sequelize-cli db:migrate
```
