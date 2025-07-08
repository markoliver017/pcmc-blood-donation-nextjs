# Form Development Guidelines

## Table of Contents

1. [Project Structure](#project-structure)
2. [Required Dependencies](#required-dependencies)
3. [Form Development Stack](#form-development-stack)
4. [Directory Structure](#directory-structure)
5. [Form Components Structure](#form-components-structure)
6. [Form Development Flow](#form-development-flow)
7. [Best Practices](#best-practices)
8. [Code Examples](#code-examples)

## Project Structure

### Required Dependencies

```json
{
    "dependencies": {
        "@hookform/resolvers": "latest",
        "@tanstack/react-query": "latest",
        "react-hook-form": "latest",
        "zod": "latest",
        "clsx": "latest",
        "@radix-ui/react-form": "latest"
    }
}
```

## Form Development Stack

1. **Form Management**

    - React Hook Form (RHF) for form state management
    - Zod for schema validation
    - TanStack Query for server state management

2. **UI Components**

    - Shadcn/ui for base components
    - DaisyUI for utility classes
    - Custom components for specific needs

3. **Server Integration**
    - Server Actions for API endpoints
    - React Query for data fetching/mutations

## Directory Structure

```
project/
├── app/
│   ├── action/
│   │   └── [entity]Action.js       # Server actions for CRUD
├── components/
│   ├── form/                       # Reusable form components
│   │   ├── FieldError.jsx
│   │   ├── InlineLabel.jsx
│   │   └── DisplayValidationErrors.jsx
│   ├── [entity]/                   # Entity-specific forms
│   │   ├── Create[Entity]Form.jsx
│   │   ├── Edit[Entity]Form.jsx
│   │   └── [Entity]DetailsForm.jsx
│   └── ui/                         # Shadcn/UI components
├── lib/
│   ├── zod/                        # Zod schemas
│   │   └── [entity]Schema.js
│   └── utils/                      # Utility functions
```

## Form Components Structure

### Basic Form Template

```jsx
"use client";

import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { entitySchema } from "@lib/zod/entitySchema";
import { storeEntity } from "@/action/entityAction";

export default function EntityForm() {
    const form = useForm({
        resolver: zodResolver(entitySchema),
        defaultValues: {
            // Define default values
        },
    });

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (data) => {
            const response = await storeEntity(data);
            if (!response.success) throw response;
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["entities"] });
            // Handle success
        },
        onError: (error) => {
            // Handle error
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(mutate)}>
                {/* Form fields */}
            </form>
        </Form>
    );
}
```

## Form Development Flow

1. **Schema Definition**

    ```javascript
    // lib/zod/entitySchema.js
    import { z } from "zod";

    export const entitySchema = z.object({
        field: z.string().min(1, "Field is required"),
        // Define other fields
    });
    ```

2. **Server Action Creation**

    ```javascript
    // app/action/entityAction.js
    "use server";

    export async function storeEntity(data) {
        try {
            // Validation and storage logic
            return { success: true, data };
        } catch (error) {
            return { success: false, error };
        }
    }
    ```

3. **Form Component Development**
    - Create form component following the template above
    - Implement form fields using shadcn/ui components
    - Add validation and error handling
    - Implement success/error notifications

## Best Practices

1. **Importing Shadcn/UI Components**

    ```javascript
    // Correct way to import shadcn/ui components
    import { Button } from "@components/ui/button";
    import { Form, FormField, FormItem } from "@components/ui/form";
    import { Input } from "@components/ui/input";
    ```

2. **DaisyUI Classes Usage**

    ```jsx
    // Common input classes
    <input className="input input-bordered input-primary w-full" />

    // Button classes
    <button className="btn btn-primary btn-sm" />

    // Form group classes
    <div className="form-control w-full" />
    ```

3. **Error Handling**

    ```jsx
    // Component level
    <DisplayValidationErrors errors={form.formState.errors} />
    <FieldError field={errors?.fieldName} />

    // Server action level
    if (error?.type === "validation") {
      toastError(error);
    }
    ```

4. **Form State Management**
    - Use `watch()` for reactive form values
    - Use `setValue()` for programmatic updates
    - Use `reset()` for form reset
    - Use `isDirty` for submit button state

## Notifications and Error Handling

### 1. Notification Components

#### SweetAlert for Confirmations

```jsx
import SweetAlert from "@components/ui/SweetAlert";

// Usage in form submissions
SweetAlert({
    title: "Confirm Action",
    text: "Are you sure you want to proceed?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, proceed",
    cancelButtonText: "Cancel",
    onConfirm: async () => {
        // Handle confirmation action
        await submitForm(data);
    },
    element_id: "form-modal", // Target modal/form element
});
```

#### Toast Notifications for Feedback

```jsx
import notify from "@components/ui/notify";

// Success notification
notify({ message: "Operation completed successfully" });

// Error notification
notify({ error: true, message: "Something went wrong" });

// Custom type notification
notify({ message: "Custom message" }, "info");
```

### 2. Error Handling Patterns

#### Server Action Error Handling

```javascript
const { mutate, isPending, error } = useMutation({
    mutationFn: async (formData) => {
        const res = await storeEntity(formData);
        if (!res.success) {
            throw res; // Throw error response to trigger onError
        }
        return res.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["entities"] });
        SweetAlert({
            title: "Success",
            text: "Operation completed successfully",
            icon: "success",
            confirmButtonText: "OK",
            onConfirm: () => router.push("/entities"),
        });
    },
    onError: (error) => {
        if (error?.type === "validation" && error?.errorArr?.length) {
            // Handle validation errors
            toastError(error);
        } else {
            // Handle server errors
            notify({
                error: true,
                message: error?.message || "An error occurred",
            });
        }
    },
});
```

#### Form Validation Display

```jsx
// Display all form validation errors
<DisplayValidationErrors errors={form.formState.errors} />

// Display individual field errors
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <Input {...field} />
      <FieldError field={errors?.fieldName} />
    </FormItem>
  )}
/>
```

### 3. Confirmation Patterns

#### Form Submission Confirmation

```jsx
const onSubmit = async (data) => {
    SweetAlert({
        title: "Form Submission",
        text: "Submit this form?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        onConfirm: async () => {
            // Handle file uploads if needed
            if (data?.file && !fileUrl) {
                const result = await uploadPicture(data.file);
                if (result?.success) {
                    data.file_url = result.file_data?.url;
                }
            }
            // Submit form data
            mutate(data);
        },
    });
};
```

#### Delete Confirmation

```jsx
const handleDelete = (id) => {
    SweetAlert({
        title: "Delete Confirmation",
        text: "This action cannot be undone",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        onConfirm: () => deleteEntity(id),
    });
};
```

### 4. Loading States

#### Form Submission Loading

```jsx
<button disabled={!isDirty || isPending} className="btn btn-primary">
    {isPending ? (
        <>
            <span className="loading loading-bars loading-xs"></span>
            Submitting...
        </>
    ) : (
        <>
            <Send />
            Submit
        </>
    )}
</button>
```

#### Loading Modal

```jsx
import LoadingModal from "@components/layout/LoadingModal";

<LoadingModal isLoading={isPending}>Processing...</LoadingModal>;
```

### 5. Best Practices for Error Handling

1. **Validation Layers**

    - Client-side validation with Zod schemas
    - Server-side validation in Server Actions
    - Database constraints

2. **Error Response Structure**

    ```javascript
    // Server Action response format
    {
      success: boolean,
      data?: any,
      error?: {
        type: "validation" | "server" | "unauthorized",
        message: string,
        errorArr?: Array<{
          field: string,
          message: string
        }>
      }
    }
    ```

3. **Error Handling Hierarchy**

    - Field-level errors using `<FieldError />`
    - Form-level validation using `<DisplayValidationErrors />`
    - Server errors using `notify()`
    - Confirmation dialogs using `SweetAlert()`

4. **Toast Notification Guidelines**
    - Success messages: Short and confirmatory
    - Error messages: Clear with possible resolution steps
    - Warning messages: Preventive with user action needed
    - Info messages: Neutral information updates

## Code Examples

### 1. Basic Input Field

```jsx
<FormField
    control={form.control}
    name="fieldName"
    render={({ field }) => (
        <FormItem>
            <InlineLabel>Field Label</InlineLabel>
            <Input {...field} className="input input-bordered" />
            <FieldError field={errors?.fieldName} />
        </FormItem>
    )}
/>
```

### 2. File Upload Field

```jsx
<FormField
    control={form.control}
    name="file"
    render={({ field }) => (
        <FormItem>
            <Input
                type="file"
                onChange={(e) => field.onChange(e.target.files[0])}
                className="file-input file-input-bordered w-full"
            />
        </FormItem>
    )}
/>
```

### 3. Select Field

```jsx
<FormField
    control={form.control}
    name="select_field"
    render={({ field }) => (
        <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </FormItem>
    )}
/>
```

### 4. Form Submission with Loading State

```jsx
<button disabled={!isDirty || isPending} className="btn btn-primary">
    {isPending ? (
        <>
            <span className="loading loading-spinner"></span>
            Submitting...
        </>
    ) : (
        "Submit"
    )}
</button>
```

## Additional Resources

1. [React Hook Form Documentation](https://react-hook-form.com/)
2. [TanStack Query Documentation](https://tanstack.com/query/latest)
3. [Zod Documentation](https://zod.dev/)
4. [Shadcn/UI Documentation](https://ui.shadcn.com/)
5. [DaisyUI Documentation](https://daisyui.com/)

## Form Implementation Patterns

### A. Single Form Implementation

#### 1. Basic Structure

```jsx
"use client";

export default function SingleEntityForm() {
    const form = useForm({
        resolver: zodResolver(entitySchema),
        defaultValues: {
            field1: "",
            field2: "",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: storeEntity,
        onSuccess: () => {
            notify({ message: "Successfully saved!" });
            router.push("/entities");
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Entity Form</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(mutate)}>
                        {/* Form fields */}
                        <div className="flex justify-end mt-4">
                            <Button type="submit" disabled={isPending}>
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
```

#### 2. Form State Management

```jsx
// Local state for UI elements
const [isPreviewMode, setIsPreviewMode] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);

// Form state access
const values = form.watch();
const isDirty = form.formState.isDirty;
const isValid = form.formState.isValid;
```

#### 3. File Upload with Preview

```jsx
const [preview, setPreview] = useState(null);

const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
        form.setValue("file", file);
    }
};

// In JSX
<FormField
    name="file"
    render={({ field }) => (
        <FormItem>
            <Input
                type="file"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
            />
            {preview && (
                <div className="mt-2">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover"
                    />
                </div>
            )}
        </FormItem>
    )}
/>;
```

### B. Multi-Step Form Implementation

#### 1. Form Section Management

```jsx
const form_sections = [
    {
        title: "Basic Info",
        class: "progress-info",
        percent: 25,
    },
    {
        title: "Details",
        class: "progress-info",
        percent: 50,
    },
    {
        title: "Attachments",
        class: "progress-info",
        percent: 75,
    },
    {
        title: "Review",
        class: "progress-success",
        percent: 100,
    },
];

const [currentSection, setCurrentSection] = useState(0);

// Progress tracking component
<div className="flex justify-center rounded items-center">
    <ul className="steps">
        {form_sections.map((sec, i) => (
            <li
                key={i}
                className={clsx(
                    "step px-2 cursor-pointer",
                    i <= currentSection && sec.class
                )}
                onClick={() => {
                    if (currentSection < i) return;
                    setCurrentSection(i);
                }}
            >
                <small className="italic">{sec.title}</small>
            </li>
        ))}
    </ul>
</div>;
```

#### 2. Section Components

```jsx
// Separate component for each form section
function BasicInfoSection({ onNext }) {
    return (
        <div className="space-y-4">
            <FormField
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <Input {...field} />
                    </FormItem>
                )}
            />
            {/* Other fields */}
            <div className="flex justify-end">
                <Button onClick={() => onNext(1)}>Next</Button>
            </div>
        </div>
    );
}

// Main form component
return (
    <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
            {currentSection === 0 && (
                <BasicInfoSection onNext={setCurrentSection} />
            )}
            {currentSection === 1 && (
                <DetailsSection onNext={setCurrentSection} />
            )}
            {/* Other sections */}
        </form>
    </Form>
);
```

#### 3. Form State Persistence

```jsx
// Save form state to localStorage
useEffect(() => {
    const values = form.getValues();
    localStorage.setItem(
        "form_draft",
        JSON.stringify({
            section: currentSection,
            values,
        })
    );
}, [form.watch(), currentSection]);

// Load saved state
useEffect(() => {
    const saved = localStorage.getItem("form_draft");
    if (saved) {
        const { section, values } = JSON.parse(saved);
        form.reset(values);
        setCurrentSection(section);
    }
}, []);
```

#### 4. Section Navigation

```jsx
const handleNext = (step) => {
    const currentValues = form.getValues();

    // Validate current section
    const sectionFields = getSectionFields(currentSection);
    const isValid = sectionFields.every(
        (field) => !form.formState.errors[field]
    );

    if (!isValid) {
        notify({
            error: true,
            message: "Please complete all required fields",
        });
        return;
    }

    setCurrentSection((prev) => prev + step);
};

const handleBack = () => {
    setCurrentSection((prev) => Math.max(0, prev - 1));
};
```

#### 5. Final Review Section

```jsx
function ReviewSection({ onBack }) {
    const values = form.getValues();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Review Your Information</CardTitle>
            </CardHeader>
            <CardContent>
                <ConfirmTable watch={form.watch} />

                <div className="flex justify-between mt-4">
                    <Button onClick={onBack}>
                        <IoArrowUndoCircle /> Back
                    </Button>
                    <Button
                        type="submit"
                        disabled={!form.formState.isDirty || isPending}
                    >
                        {isPending ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
```

### C. Form State Management Patterns

#### 1. Dynamic Form Fields

```jsx
const [fields, setFields] = useState([{ id: 1 }]);

const addField = () => {
    setFields((prev) => [...prev, { id: prev.length + 1 }]);
};

const removeField = (id) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
};

// In JSX
{
    fields.map((field) => (
        <div key={field.id} className="flex gap-2">
            <FormField
                name={`dynamic_field_${field.id}`}
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <Input {...field} />
                    </FormItem>
                )}
            />
            <Button onClick={() => removeField(field.id)}>Remove</Button>
        </div>
    ));
}
<Button onClick={addField}>Add Field</Button>;
```

#### 2. Conditional Form Fields

```jsx
const watchOrganizationType = form.watch("organization_type");

// In JSX
<FormField
    name="organization_type"
    render={({ field }) => (
        <FormItem>
            <Select {...field}>
                <SelectTrigger>
                    <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                </SelectContent>
            </Select>
        </FormItem>
    )}
/>;

{
    watchOrganizationType === "other" && (
        <FormField
            name="other_organization_type"
            render={({ field }) => (
                <FormItem>
                    <Input {...field} placeholder="Please specify..." />
                </FormItem>
            )}
        />
    );
}
```

#### 3. Form Data Transformation

```jsx
const onSubmit = async (data) => {
    // Transform data before submission
    const transformedData = {
        ...data,
        // Convert date strings to Date objects
        date: new Date(data.date),
        // Format numbers
        amount: parseFloat(data.amount),
        // Filter arrays
        tags: data.tags.filter(Boolean),
        // Transform nested data
        address: {
            street: data.street,
            city: data.city,
            country: data.country,
        },
    };

    mutate(transformedData);
};
```

#### 4. Form Reset and Clear

```jsx
const resetForm = () => {
    // Reset to initial values
    form.reset();
    // Clear specific fields
    form.setValue("field1", "");
    // Reset file inputs
    setPreview(null);
    // Clear localStorage
    localStorage.removeItem("form_draft");
};

// Confirm before resetting
const handleReset = () => {
    SweetAlert({
        title: "Reset Form",
        text: "This will clear all entered data. Continue?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, reset",
        onConfirm: resetForm,
    });
};
```

### D. Form Submission Patterns

#### 1. Pre-submission Validation

```jsx
const validateBeforeSubmit = async (data) => {
    // Custom validation
    const errors = [];

    if (data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
        errors.push("End date must be after start date");
    }

    if (data.attachments?.length > 5) {
        errors.push("Maximum 5 attachments allowed");
    }

    if (errors.length) {
        notify({ error: true, message: errors.join(", ") });
        return false;
    }

    return true;
};

const onSubmit = async (data) => {
    if (!(await validateBeforeSubmit(data))) return;

    SweetAlert({
        title: "Confirm Submission",
        text: "Please review before submitting",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Submit",
        onConfirm: () => mutate(data),
    });
};
```

#### 2. File Upload Handling

```jsx
const handleFileUpload = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadPicture(formData);
        if (result.success) {
            form.setValue("file_url", result.file_data.url);
            notify({ message: "File uploaded successfully" });
        }
    } catch (error) {
        notify({
            error: true,
            message: "Failed to upload file",
        });
    }
};
```

#### 3. Batch Operations

```jsx
const handleBatchSubmit = async (items) => {
    try {
        const results = await Promise.all(
            items.map((item) => storeEntity(item))
        );

        const failures = results.filter((r) => !r.success);
        if (failures.length) {
            notify({
                error: true,
                message: `${failures.length} items failed to save`,
            });
        } else {
            notify({ message: "All items saved successfully" });
        }
    } catch (error) {
        notify({
            error: true,
            message: "Batch operation failed",
        });
    }
};
```

## E. Specific Form Type Examples

### 1. Authentication Forms

```jsx
export function LoginForm() {
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            router.push("/dashboard");
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(mutate)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input type="email" {...field} />
                                    <FieldError field={errors?.email} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <div className="relative">
                                        <Input type="password" {...field} />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                            onClick={() =>
                                                togglePasswordVisibility()
                                            }
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <FieldError field={errors?.password} />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </CardFooter>
                </Card>
                <LoadingModal isLoading={isPending}>
                    Authenticating...
                </LoadingModal>
            </form>
        </Form>
    );
}
```

### 2. Search Forms with Filters

```jsx
export function SearchForm() {
    const [filters, setFilters] = useState([]);
    const form = useForm({
        defaultValues: {
            search: "",
            category: "",
            dateRange: {
                from: null,
                to: null,
            },
            filters: [],
        },
    });

    const { data, isLoading } = useQuery({
        queryKey: ["search", form.watch()],
        queryFn: () => searchItems(form.getValues()),
        enabled: form.watch("search")?.length > 2,
    });

    return (
        <Form {...form}>
            <form>
                <div className="flex gap-4 flex-wrap">
                    <FormField
                        name="search"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <Input
                                    {...field}
                                    placeholder="Search..."
                                    leftIcon={<Search className="h-4 w-4" />}
                                />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <Select
                                    {...field}
                                    options={categories}
                                    placeholder="Category"
                                />
                            </FormItem>
                        )}
                    />
                    <DateRangePicker
                        onChange={(range) => form.setValue("dateRange", range)}
                    />
                </div>
                <div className="mt-4">
                    {filters.map((filter) => (
                        <Chip
                            key={filter}
                            onRemove={() => removeFilter(filter)}
                        >
                            {filter}
                        </Chip>
                    ))}
                </div>
                <LoadingModal isLoading={isLoading}>Searching...</LoadingModal>
            </form>
        </Form>
    );
}
```

### 3. Data Grid with Inline Editing

```jsx
export function DataGridForm() {
    const form = useForm({
        defaultValues: {
            rows: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "rows",
    });

    return (
        <Form {...form}>
            <form>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((field, index) => (
                            <TableRow key={field.id}>
                                <TableCell>
                                    <FormField
                                        name={`rows.${index}.name`}
                                        render={({ field }) => (
                                            <Input {...field} />
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <FormField
                                        name={`rows.${index}.quantity`}
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => remove(index)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button
                    onClick={() => append({ name: "", quantity: 0, price: 0 })}
                >
                    Add Row
                </Button>
            </form>
        </Form>
    );
}
```

## F. Advanced Validation Patterns

### 1. Cross-Field Validation

```javascript
const formSchema = z
    .object({
        password: z.string().min(8),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"],
    });

const dateRangeSchema = z
    .object({
        startDate: z.date(),
        endDate: z.date(),
    })
    .refine((data) => data.startDate < data.endDate, {
        message: "End date must be after start date",
        path: ["endDate"],
    });
```

### 2. Async Validation

```javascript
const usernameSchema = z.string().refine(
    async (username) => {
        const response = await checkUsernameAvailable(username);
        return response.available;
    },
    {
        message: "Username already taken",
        params: { async: true },
    }
);

// In component
const validateUsername = async (username) => {
    try {
        await usernameSchema.parseAsync(username);
        return true;
    } catch (error) {
        return false;
    }
};
```

### 3. Conditional Validation

```javascript
const organizationSchema = z
    .object({
        type: z.enum(["business", "individual", "other"]),
        businessName: z.string().optional(),
        taxId: z.string().optional(),
        otherDetails: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.type === "business") {
                return !!data.businessName && !!data.taxId;
            }
            if (data.type === "other") {
                return !!data.otherDetails;
            }
            return true;
        },
        {
            message: "Required fields missing for selected type",
            path: ["type"],
        }
    );
```

## G. Enhanced UI Components

### 1. Rich Text Editor Integration

```jsx
function RichTextEditor({ name, control }) {
    return (
        <FormField
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Content</FormLabel>
                    <Editor
                        value={field.value}
                        onChange={field.onChange}
                        extensions={[StarterKit, Highlight, Typography]}
                        className="min-h-[200px] border rounded-md p-4"
                    />
                </FormItem>
            )}
        />
    );
}
```

### 2. Advanced Select with Search

```jsx
function SearchableSelect({ name, options, control }) {
    return (
        <FormField
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem>
                    <Select
                        {...field}
                        filterOption={(input, option) =>
                            option.label
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        showSearch
                        options={options}
                    >
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </Select>
                </FormItem>
            )}
        />
    );
}
```

### 3. File Upload with Progress

```jsx
function FileUploadField({ name, control }) {
    const [progress, setProgress] = useState(0);

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("/api/upload", formData, {
                onUploadProgress: (progressEvent) => {
                    const percentage =
                        (progressEvent.loaded * 100) / progressEvent.total;
                    setProgress(Math.round(percentage));
                },
            });

            return response.data.url;
        } catch (error) {
            notify({ error: true, message: "Upload failed" });
            throw error;
        }
    };

    return (
        <FormField
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem>
                    <div className="border-2 border-dashed rounded-lg p-4">
                        <Input
                            type="file"
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const url = await uploadFile(file);
                                    field.onChange(url);
                                }
                            }}
                        />
                        {progress > 0 && progress < 100 && (
                            <Progress value={progress} className="mt-2" />
                        )}
                    </div>
                </FormItem>
            )}
        />
    );
}
```

## H. Form Accessibility Guidelines

### 1. Keyboard Navigation

```jsx
function AccessibleForm() {
    const [focusIndex, setFocusIndex] = useState(0);
    const fieldRefs = useRef([]);

    const handleKeyDown = (e, index) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setFocusIndex((index + 1) % fieldRefs.current.length);
                break;
            case "ArrowUp":
                e.preventDefault();
                setFocusIndex(
                    index === 0 ? fieldRefs.current.length - 1 : index - 1
                );
                break;
        }
    };

    useEffect(() => {
        fieldRefs.current[focusIndex]?.focus();
    }, [focusIndex]);

    return (
        <form>
            <div role="group" aria-label="Form fields">
                {fields.map((field, index) => (
                    <Input
                        key={field.id}
                        ref={(el) => (fieldRefs.current[index] = el)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        aria-label={field.label}
                    />
                ))}
            </div>
        </form>
    );
}
```

### 2. ARIA Labels and Descriptions

```jsx
<FormField
    name="email"
    render={({ field }) => (
        <FormItem>
            <FormLabel htmlFor={field.name}>Email Address</FormLabel>
            <Input
                {...field}
                id={field.name}
                aria-describedby={`${field.name}-hint ${field.name}-error`}
            />
            <p id={`${field.name}-hint`} className="text-sm text-gray-500">
                Enter your work email address
            </p>
            <div id={`${field.name}-error`} role="alert" aria-live="polite">
                <FieldError field={errors?.email} />
            </div>
        </FormItem>
    )}
/>
```

### 3. Focus Management

```jsx
function FocusManagement() {
    const errorRef = useRef(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (hasError) {
            errorRef.current?.focus();
        }
    }, [hasError]);

    return (
        <div>
            {hasError && (
                <div
                    ref={errorRef}
                    tabIndex={-1}
                    role="alert"
                    className="error-message"
                >
                    Please correct the errors below
                </div>
            )}
            {/* Form fields */}
        </div>
    );
}
```

## I. Form Testing Strategies

### 1. Unit Testing Form Components

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("LoginForm", () => {
    it("should validate required fields", async () => {
        render(<LoginForm />);

        const submitButton = screen.getByRole("button", { name: /submit/i });
        await userEvent.click(submitButton);

        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    it("should submit form with valid data", async () => {
        const onSubmit = jest.fn();
        render(<LoginForm onSubmit={onSubmit} />);

        await userEvent.type(
            screen.getByLabelText(/email/i),
            "test@example.com"
        );
        await userEvent.type(screen.getByLabelText(/password/i), "password123");
        await userEvent.click(screen.getByRole("button", { name: /submit/i }));

        expect(onSubmit).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "password123",
        });
    });
});
```

### 2. Integration Testing Form Submissions

```javascript
import { renderHook } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("Form Submission", () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient();
    });

    it("should handle successful submission", async () => {
        const wrapper = ({ children }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );

        const { result } = renderHook(() => useSubmitForm(), { wrapper });

        await act(async () => {
            await result.current.mutate(testData);
        });

        expect(result.current.isSuccess).toBe(true);
    });
});
```

### 3. E2E Testing Form Flows

```javascript
describe("Multi-step Form", () => {
    beforeEach(() => {
        cy.visit("/registration");
    });

    it("should complete all steps and submit", () => {
        // Step 1: Basic Info
        cy.get('[name="firstName"]').type("John");
        cy.get('[name="lastName"]').type("Doe");
        cy.get('[data-testid="next-button"]').click();

        // Step 2: Contact Info
        cy.get('[name="email"]').type("john@example.com");
        cy.get('[name="phone"]').type("1234567890");
        cy.get('[data-testid="next-button"]').click();

        // Step 3: Review
        cy.get('[data-testid="submit-button"]').click();

        // Assert success
        cy.get('[role="alert"]')
            .should("be.visible")
            .and("contain", "Registration successful");
    });
});
```

### 4. Mocking API Responses

```javascript
describe("Form with API calls", () => {
    beforeEach(() => {
        cy.intercept("POST", "/api/submit", {
            statusCode: 200,
            body: { success: true },
        }).as("submitForm");

        cy.intercept("GET", "/api/validate-email", {
            statusCode: 200,
            body: { available: true },
        }).as("validateEmail");
    });

    it("should handle API responses", () => {
        cy.get('[name="email"]').type("test@example.com");
        cy.wait("@validateEmail");

        cy.get("form").submit();
        cy.wait("@submitForm");

        cy.get('[role="alert"]').should(
            "contain",
            "Form submitted successfully"
        );
    });
});
```

## J. Standard Loading States

### 1. Form Submission Loading

```jsx
export function StandardFormSubmission() {
    const { mutate, isPending } = useMutation({
        mutationFn: submitForm,
        onSuccess: () => {
            // Handle success
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(mutate)}>
                {/* Form fields */}
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit"}
                </Button>
                <LoadingModal isLoading={isPending}>
                    Processing your request...
                </LoadingModal>
            </form>
        </Form>
    );
}
```

### 2. Section Loading

```jsx
export function SectionLoading({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="relative">
            {children}
            <LoadingModal isLoading={isLoading}>
                Loading section data...
            </LoadingModal>
        </div>
    );
}
```

### 3. Conditional Loading States

```jsx
export function ConditionalLoading() {
  const { isPending: isSubmitting } = useMutation({ ... });
  const { isPending: isValidating } = useMutation({ ... });
  const { isLoading: isFetching } = useQuery({ ... });

  const isProcessing = isSubmitting || isValidating || isFetching;

  return (
    <div>
      {/* Form content */}
      <LoadingModal isLoading={isProcessing}>
        {isSubmitting && "Submitting form..."}
        {isValidating && "Validating data..."}
        {isFetching && "Fetching data..."}
      </LoadingModal>
    </div>
  );
}
```

## K. Advanced Form Examples

### 1. Dynamic Multi-Column Form

```jsx
function DynamicColumnsForm() {
    const form = useForm({
        defaultValues: {
            columns: [{ id: 1, fields: [{ name: "", type: "text" }] }],
        },
    });

    const { fields: columns, append: appendColumn } = useFieldArray({
        control: form.control,
        name: "columns",
    });

    return (
        <Form {...form}>
            <form>
                <div className="grid grid-cols-12 gap-4">
                    {columns.map((column, colIndex) => (
                        <div key={column.id} className="col-span-4">
                            <NestedFieldArray
                                control={form.control}
                                name={`columns.${colIndex}.fields`}
                            />
                        </div>
                    ))}
                    <Button onClick={() => appendColumn({ fields: [] })}>
                        Add Column
                    </Button>
                </div>
            </form>
        </Form>
    );
}
```

### 2. Wizard Form with Side Navigation

```jsx
function WizardForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
        { id: "personal", title: "Personal Info", icon: <UserIcon /> },
        { id: "contact", title: "Contact Details", icon: <PhoneIcon /> },
        { id: "preferences", title: "Preferences", icon: <SettingsIcon /> },
    ];

    return (
        <div className="flex gap-6">
            {/* Side Navigation */}
            <div className="w-64 bg-slate-100 p-4 rounded-lg">
                <nav>
                    {steps.map((step, index) => (
                        <button
                            key={step.id}
                            className={clsx(
                                "flex items-center gap-2 w-full p-2 rounded",
                                currentStep === index &&
                                    "bg-primary text-white",
                                currentStep > index && "text-success"
                            )}
                            onClick={() => setCurrentStep(index)}
                        >
                            {step.icon}
                            <span>{step.title}</span>
                            {currentStep > index && (
                                <CheckIcon className="ml-auto" />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Form Content */}
            <div className="flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        {currentStep === 0 && <PersonalInfoStep />}
                        {currentStep === 1 && <ContactDetailsStep />}
                        {currentStep === 2 && <PreferencesStep />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
```

## L. Advanced Validation Scenarios

### 1. Complex Dependency Validation

```javascript
const complexFormSchema = z
    .object({
        serviceType: z.enum(["basic", "premium", "enterprise"]),
        features: z.array(z.string()),
        userCount: z.number(),
        customDomain: z.string().optional(),
        apiAccess: z.boolean(),
        apiKeys: z.array(z.string()).optional(),
    })
    .superRefine((data, ctx) => {
        // Service type dependencies
        if (data.serviceType === "basic" && data.features.length > 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Basic plan can only have up to 3 features",
                path: ["features"],
            });
        }

        // User count validation
        const userLimits = {
            basic: 10,
            premium: 50,
            enterprise: Infinity,
        };
        if (data.userCount > userLimits[data.serviceType]) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `${data.serviceType} plan supports max ${
                    userLimits[data.serviceType]
                } users`,
                path: ["userCount"],
            });
        }

        // API access validation
        if (data.apiAccess && !data.apiKeys?.length) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "API keys are required when API access is enabled",
                path: ["apiKeys"],
            });
        }
    });
```

### 2. Contextual Validation

```javascript
const registrationSchema = z
    .object({
        userType: z.enum(["individual", "business"]),
        email: z.string().email(),
        companyName: z.string().optional(),
        vatNumber: z.string().optional(),
        individualFields: z
            .object({
                firstName: z.string(),
                lastName: z.string(),
                dateOfBirth: z.date(),
            })
            .optional(),
        businessFields: z
            .object({
                registrationNumber: z.string(),
                incorporationDate: z.date(),
                businessType: z.string(),
            })
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.userType === "business") {
            if (!data.companyName) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Company name is required for business accounts",
                    path: ["companyName"],
                });
            }
            if (!data.businessFields) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Business information is required",
                    path: ["businessFields"],
                });
            }
        } else {
            if (!data.individualFields) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Individual information is required",
                    path: ["individualFields"],
                });
            }
        }
    });
```

## M. Error Handling Patterns

### 1. API Error Handler

```typescript
interface ApiError {
    code: string;
    message: string;
    validation?: {
        field: string;
        message: string;
    }[];
}

function handleApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        // Handle validation errors
        if (error.response?.status === 422) {
            return {
                code: "VALIDATION_ERROR",
                message: "Please check the form for errors",
                validation: data.errors,
            };
        }

        // Handle authentication errors
        if (error.response?.status === 401) {
            return {
                code: "AUTH_ERROR",
                message: "Please log in to continue",
            };
        }

        // Handle server errors
        if (error.response?.status >= 500) {
            return {
                code: "SERVER_ERROR",
                message: "An unexpected error occurred. Please try again",
            };
        }
    }

    // Handle network errors
    if (error instanceof Error) {
        return {
            code: "NETWORK_ERROR",
            message: "Please check your internet connection",
        };
    }

    // Handle unknown errors
    return {
        code: "UNKNOWN_ERROR",
        message: "An unexpected error occurred",
    };
}
```

### 2. Form-specific Error Handling

```jsx
function FormErrorHandler({ children }) {
    const [error, setError] = useState(null);

    const handleError = useCallback((error) => {
        const apiError = handleApiError(error);

        switch (apiError.code) {
            case "VALIDATION_ERROR":
                // Update form errors
                apiError.validation?.forEach(({ field, message }) => {
                    form.setError(field, { message });
                });
                break;

            case "AUTH_ERROR":
                // Redirect to login
                router.push("/login");
                break;

            default:
                // Show error in UI
                setError(apiError);
                break;
        }
    }, []);

    if (error) {
        return (
            <div className="space-y-4">
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
                <Button onClick={() => setError(null)}>Dismiss</Button>
            </div>
        );
    }

    return children(handleError);
}

// Usage
function MyForm() {
    return (
        <FormErrorHandler>
            {(handleError) => (
                <form
                    onSubmit={async (e) => {
                        try {
                            await submitForm(data);
                        } catch (error) {
                            handleError(error);
                        }
                    }}
                >
                    {/* Form fields */}
                </form>
            )}
        </FormErrorHandler>
    );
}
```

## N. File Upload Handling and Error Utilities

### 1. File Upload Service

```javascript
// app/action/uploads.js
export async function uploadPicture(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("YOUR_UPLOAD_ENDPOINT", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "File upload failed");
        }

        return data;
    } catch (err) {
        console.error("Upload error:", err);
        return {
            success: false,
            message: err.message || "Something went wrong during upload",
        };
    }
}
```

### 2. Pre-Mutation File Upload Pattern

```javascript
const [isUploading, setIsUploading] = useState(false);

const onSubmit = async (data) => {
    SweetAlert({
        title: "Confirmation",
        text: "Submit now?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Proceed",
        cancelButtonText: "Cancel",
        onConfirm: async () => {
            let uploadErrors = false;
            const fileUrl = watch("file_url");

            if (data?.file && !fileUrl) {
                setIsUploading(true); // Show loading state
                const result = await uploadPicture(data.file);
                if (result?.success) {
                    data.file_url = result.file_data?.url || null;
                    setValue("file_url", result.file_data?.url);
                } else {
                    uploadErrors = true;
                    notify({
                        error: true,
                        message: result.message,
                    });
                }
            }

            const fileImage = watch("image");
            if (data?.profile_picture && !fileImage) {
                setIsUploading(true); // Show loading state
                const result = await uploadPicture(data.profile_picture);
                if (result?.success) {
                    data.image = result.file_data?.url || null;
                    setValue("image", result.file_data?.url);
                } else {
                    uploadErrors = true;
                    notify({
                        error: true,
                        message: result.message,
                    });
                }
            }

            setIsUploading(false); // Hide loading state
            if (uploadErrors) return;

            mutate(data);
        },
    });
};

// In your JSX
return (
    <form onSubmit={handleSubmit(onSubmit)}>
        {/* Form fields */}
        <LoadingModal isLoading={isPending || isUploading}>
            Processing...
        </LoadingModal>
    </form>
);
```

### 6. Loading Modal Component

```jsx
// components/layout/LoadingModal.jsx
export default function LoadingModal({ imgSrc = "/loader_2.gif", isLoading }) {
    return (
        <Dialog defaultOpen={true} open={isLoading} modal={true}>
            <DialogContentNoX
                onInteractOutside={(event) => event.preventDefault()}
                className="w-120 h-96 overflow-y-scroll"
                tabIndex={-1}
            >
                <div className="flex flex-col justify-center items-center">
                    <Image
                        src={imgSrc}
                        className="flex-none rounded-4xl"
                        width={250}
                        height={250}
                        layout="intrinsic"
                        alt="Logo"
                    />
                    <motion.span
                        initial={{ color: "#4b5563" }}
                        animate={{ color: ["#4b5563", "#facc15", "#4b5563"] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        Processing ...
                    </motion.span>
                </div>
            </DialogContentNoX>
        </Dialog>
    );
}
```

### 7. Loading State Management Best Practices

1. **Combined Loading States**

    ```jsx
    // Combine multiple loading states for LoadingModal
    <LoadingModal isLoading={isPending || isUploading}>
        Processing...
    </LoadingModal>
    ```

2. **Loading State Hierarchy**

    - `isUploading`: For file upload operations
    - `isPending`: For form submission/mutation
    - `isValidating`: For form validation
    - `isFetching`: For data fetching

3. **Loading State Guidelines**

    - Use separate states for different operations
    - Combine states when showing loading UI
    - Reset states after operation completion
    - Prevent user interaction during loading

4. **Loading UI Components**

    - Use modal for blocking operations
    - Show progress indicators
    - Provide operation feedback
    - Handle loading state transitions

5. **Error Handling During Loading**
    - Clear loading states on error
    - Show appropriate error messages
    - Allow retry operations
    - Maintain form state during errors

## O. React-Select Integration Patterns

### 1. Proper React-Select Implementation

#### Dynamic Import for SSR Compatibility

```jsx
import dynamic from "next/dynamic";
import { getSingleStyle } from "@/styles/select-styles";

// Dynamic import to avoid SSR issues
const AsyncSelectNoSSR = dynamic(() => import("react-select/async"), {
    ssr: false,
});
```

#### Controller Integration with React Hook Form

```jsx
import { Controller, useForm } from "react-hook-form";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";

export function AsyncSelectField() {
    const { resolvedTheme } = useTheme();
    const { control } = useForm();

    // TanStack Query for fetching all options
    const { data: optionsResponse, isLoading: isLoadingOptions } = useQuery({
        queryKey: ["options"],
        queryFn: fetchAllOptions,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    const options = optionsResponse?.success ? optionsResponse.data : [];

    // Client-side filtering for react-select
    const loadOptions = async (inputValue) => {
        if (!options.length) return [];

        const filteredOptions = options.filter((option) => {
            const searchTerm = inputValue.toLowerCase();
            const optionText = option.name.toLowerCase();

            return optionText.includes(searchTerm);
        });

        return filteredOptions.map((option) => ({
            value: option.id,
            label: option.name,
        }));
    };

    return (
        <Controller
            control={control}
            name="field_name"
            render={({ field: { onChange, value, name, ref } }) => (
                <AsyncSelectNoSSR
                    name={name}
                    ref={ref}
                    isClearable
                    loadOptions={loadOptions}
                    onChange={(option) => {
                        onChange(option?.value || null);
                        // Additional logic when option changes
                    }}
                    value={
                        value
                            ? {
                                  value: value,
                                  label: "Loading...",
                              }
                            : null
                    }
                    styles={getSingleStyle(resolvedTheme)}
                    placeholder="Search for options..."
                    className="react-select"
                    isLoading={isLoadingOptions}
                    noOptionsMessage={() => "No options found"}
                    loadingMessage={() => "Loading options..."}
                />
            )}
        />
    );
}
```

### 2. Conditional Form Fields Pattern

#### Show/Hide Fields Based on Selection

```jsx
export function ConditionalFormFields() {
    const form = useForm();
    const watchField = form.watch("conditional_field");
    const isConditionMet = !!watchField;

    return (
        <Form {...form}>
            <form>
                {/* Always visible field */}
                <FormField
                    name="conditional_field"
                    render={({ field }) => (
                        <FormItem>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="option1">
                                        Option 1
                                    </SelectItem>
                                    <SelectItem value="option2">
                                        Option 2
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                {/* Show only when condition is NOT met */}
                {!isConditionMet && (
                    <FormField
                        name="alternative_field"
                        render={({ field }) => (
                            <FormItem>
                                <Input
                                    {...field}
                                    placeholder="Alternative input"
                                />
                            </FormItem>
                        )}
                    />
                )}

                {/* Show only when condition IS met */}
                {isConditionMet && (
                    <FormField
                        name="dependent_field"
                        render={({ field }) => (
                            <FormItem>
                                <Input
                                    {...field}
                                    placeholder="Dependent input"
                                />
                            </FormItem>
                        )}
                    />
                )}
            </form>
        </Form>
    );
}
```

### 3. Cross-Field Dependencies

#### Clear Related Fields When Selection Changes

```jsx
<Controller
    control={form.control}
    name="primary_selection"
    render={({ field: { onChange, value, name, ref } }) => (
        <AsyncSelectNoSSR
            name={name}
            ref={ref}
            onChange={(option) => {
                onChange(option?.value || null);

                // Clear dependent fields when primary selection changes
                if (option?.value) {
                    form.setValue("dependent_field1", "");
                    form.setValue("dependent_field2", "");
                    form.setValue("dependent_field3", "");
                }
            }}
            // ... other props
        />
    )}
/>
```

### 4. React-Select Best Practices

#### 1. Error Handling in Load Options

```jsx
const loadOptions = async (inputValue) => {
    try {
        const response = await fetchOptions(inputValue || "");
        if (response.success) {
            return response.data.map((item) => ({
                value: item.id,
                label: item.name,
            }));
        }
        return [];
    } catch (error) {
        console.error("Error loading options:", error);
        notify({
            error: true,
            message: "Failed to load options",
        });
        return [];
    }
};
```

#### 2. Proper Value Handling

```jsx
// For single selection
value={
    value
        ? {
              value: value,
              label: "Loading...", // Will be updated when options load
          }
        : null
}

// For multi-selection
value={
    value?.map((item) => ({
        value: item.id,
        label: item.name,
    })) || []
}
```

#### 3. Theme Integration

```jsx
import { useTheme } from "next-themes";

const { resolvedTheme } = useTheme();

<AsyncSelectNoSSR
    styles={getSingleStyle(resolvedTheme)}
    // ... other props
/>;
```

#### 4. Loading States

```jsx
// TanStack Query handles loading state
const { data: optionsResponse, isLoading: isLoadingOptions } = useQuery({
    queryKey: ["options"],
    queryFn: fetchAllOptions,
});

// In JSX
<AsyncSelectNoSSR
    isLoading={isLoadingOptions}
    noOptionsMessage={() => "No options found"}
    loadingMessage={() => "Loading options..."}
    // ... other props
/>;
```

#### 5. Client-Side vs Server-Side Filtering

**Recommended Pattern: Client-Side Filtering**

```jsx
// ✅ GOOD: Fetch all data once, filter on client
const { data: optionsResponse } = useQuery({
    queryKey: ["options"],
    queryFn: fetchAllOptions, // No search parameter
});

const loadOptions = async (inputValue) => {
    const options = optionsResponse?.success ? optionsResponse.data : [];

    return options
        .filter((option) =>
            option.name.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((option) => ({
            value: option.id,
            label: option.name,
        }));
};
```

**Avoid: Server-Side Filtering for Small Datasets**

```jsx
// ❌ BAD: Making API calls for each search
const loadOptions = async (inputValue) => {
    const response = await fetchOptions(inputValue); // API call per search
    return response.data.map((item) => ({
        value: item.id,
        label: item.name,
    }));
};
```

**When to Use Server-Side Filtering**

-   Large datasets (1000+ items)
-   Complex search requirements
-   Performance concerns with client-side filtering
-   Real-time data that changes frequently

````

### 5. Conditional Field Validation

#### Dynamic Schema Based on Selection

```javascript
const conditionalSchema = z
    .object({
        selection_type: z.enum(["registered", "unregistered"]),
        user_id: z.string().optional(),
        patient_name: z.string().optional(),
        patient_date_of_birth: z.string().optional(),
        patient_gender: z.enum(["male", "female"]).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.selection_type === "registered") {
            if (!data.user_id) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Please select a registered user",
                    path: ["user_id"],
                });
            }
        } else {
            if (!data.patient_name) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Patient name is required",
                    path: ["patient_name"],
                });
            }
            if (!data.patient_date_of_birth) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Patient date of birth is required",
                    path: ["patient_date_of_birth"],
                });
            }
        }
    });
````
