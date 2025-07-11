# Contact Form Implementation Plan

## Overview

Transform the current ContactForm from a mock implementation to a fully functional form following the established form development guidelines, including database integration, server actions, and notifications.

## Current State Analysis

-   **Form**: Basic React form with mock submission
-   **Validation**: No client-side validation
-   **Database**: No persistence
-   **Notifications**: No system integration
-   **Error Handling**: Basic error display

## Implementation Plan

### Phase 1: Database Schema & Model Creation

#### 1.1 Create ContactForm Sequelize Model

**File**: `lib/models/ContactFormModel.js`

**Schema Design**:

```javascript
{
  id: INTEGER (Primary Key, Auto Increment)
  name: STRING (Required)
  email: STRING (Required, Email validation)
  phone: STRING (Optional)
  subject: ENUM (Required - predefined options)
  message: TEXT (Required)
  status: ENUM (Default: 'pending', Options: 'pending', 'in_progress', 'resolved', 'closed')
  priority: ENUM (Default: 'normal', Options: 'low', 'normal', 'high', 'urgent')
  assigned_to: UUID (Optional - for admin assignment)
  resolved_by: UUID (Optional - admin who resolved)
  resolved_at: DATE (Optional)
  admin_notes: TEXT (Optional - internal notes)
  created_at: DATE
  updated_at: DATE
}
```

**Model Features**:

-   Email validation
-   Subject enum validation
-   Status tracking
-   Priority levels
-   Admin assignment capability
-   Resolution tracking
-   Audit fields

#### 1.2 Create Zod Schema

**File**: `lib/zod/contactFormSchema.js`

**Schemas**:

-   `contactFormSchema` - Basic form validation
-   `contactFormStatusSchema` - Status update validation
-   `contactFormAssignmentSchema` - Admin assignment validation

### Phase 2: Server Actions Implementation

#### 2.1 Create Contact Form Actions

**File**: `app/action/contactFormAction.js`

**Functions**:

1. `storeContactForm(formData)` - Store new contact form submission
2. `fetchContactForms()` - Fetch all contact forms (admin)
3. `fetchContactForm(id)` - Fetch single contact form
4. `updateContactFormStatus(formData)` - Update status/priority
5. `assignContactForm(formData)` - Assign to admin
6. `resolveContactForm(formData)` - Mark as resolved
7. `fetchContactFormsByStatus(status)` - Filter by status

#### 2.2 Notification Integration

**Notification Types**:

-   `CONTACT_FORM` - New contact form submission
-   `CONTACT_FORM_ASSIGNED` - Form assigned to admin
-   `CONTACT_FORM_RESOLVED` - Form resolved

**Recipients**:

-   All admins (new submission)
-   Assigned admin (assignment)
-   Form submitter (resolution confirmation)

### Phase 3: Form Component Refactoring

#### 3.1 Update ContactForm Component

**File**: `components/pages/ContactUs/ContactForm.jsx`

**Changes**:

-   Replace useState with React Hook Form
-   Add Zod validation
-   Implement TanStack Query for mutations
-   Add proper error handling
-   Add loading states
-   Add success/error notifications
-   Add form reset functionality

#### 3.2 Form Features

-   Real-time validation
-   Loading states during submission
-   Success/error feedback
-   Form reset after successful submission
-   Proper accessibility
-   Mobile responsiveness

### Phase 4: Admin Interface (Future Enhancement)

#### 4.1 Contact Form Management

-   Dashboard for viewing all submissions
-   Status management interface
-   Assignment functionality
-   Resolution tracking
-   Search and filtering
-   Export capabilities

## Detailed Implementation Steps

### Step 1: Create ContactForm Model

```javascript
// lib/models/ContactFormModel.js
const ContactFormModel = (sequelize, DataTypes) => {
    const ContactForm = sequelize.define(
        "ContactForm",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "Name is required." },
                    len: {
                        args: [2, 100],
                        msg: "Name must be between 2 and 100 characters.",
                    },
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: { msg: "Please enter a valid email address." },
                    notEmpty: { msg: "Email is required." },
                },
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 20],
                        msg: "Phone number must be less than 20 characters.",
                    },
                },
            },
            subject: {
                type: DataTypes.ENUM(
                    "General Inquiry",
                    "Blood Donation Appointment",
                    "Blood Drive Organization",
                    "Emergency Blood Request",
                    "Volunteer Opportunities",
                    "Partnership Inquiry",
                    "Technical Support",
                    "Other"
                ),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "Subject is required." },
                },
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "Message is required." },
                    len: {
                        args: [10, 2000],
                        msg: "Message must be between 10 and 2000 characters.",
                    },
                },
            },
            status: {
                type: DataTypes.ENUM(
                    "pending",
                    "in_progress",
                    "resolved",
                    "closed"
                ),
                allowNull: false,
                defaultValue: "pending",
                validate: {
                    isIn: {
                        args: [
                            ["pending", "in_progress", "resolved", "closed"],
                        ],
                        msg: "Invalid status.",
                    },
                },
            },
            priority: {
                type: DataTypes.ENUM("low", "normal", "high", "urgent"),
                allowNull: false,
                defaultValue: "normal",
                validate: {
                    isIn: {
                        args: [["low", "normal", "high", "urgent"]],
                        msg: "Invalid priority level.",
                    },
                },
            },
            assigned_to: {
                type: DataTypes.UUID,
                allowNull: true,
                validate: {
                    async isValidUser(value) {
                        if (value) {
                            const User = sequelize.models.User;
                            const user = await User.findByPk(value);
                            if (!user) {
                                throw new Error("Invalid assigned user ID.");
                            }
                        }
                    },
                },
            },
            resolved_by: {
                type: DataTypes.UUID,
                allowNull: true,
                validate: {
                    async isValidUser(value) {
                        if (value) {
                            const User = sequelize.models.User;
                            const user = await User.findByPk(value);
                            if (!user) {
                                throw new Error("Invalid resolved by user ID.");
                            }
                        }
                    },
                },
            },
            resolved_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            admin_notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        { timestamps: true, tableName: "contact_forms" }
    );

    ContactForm.associate = (models) => {
        ContactForm.belongsTo(models.User, {
            foreignKey: "assigned_to",
            as: "assignedUser",
        });
        ContactForm.belongsTo(models.User, {
            foreignKey: "resolved_by",
            as: "resolvedByUser",
        });
    };

    return ContactForm;
};
```

### Step 2: Create Zod Schemas

```javascript
// lib/zod/contactFormSchema.js
import { z } from "zod";

export const contactFormSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    subject: z.enum(
        [
            "General Inquiry",
            "Blood Donation Appointment",
            "Blood Drive Organization",
            "Emergency Blood Request",
            "Volunteer Opportunities",
            "Partnership Inquiry",
            "Technical Support",
            "Other",
        ],
        { required_error: "Please select a subject" }
    ),
    message: z
        .string()
        .min(10, "Message must be at least 10 characters")
        .max(2000, "Message must be less than 2000 characters"),
});

export const contactFormStatusSchema = z.object({
    id: z.number().positive("Invalid contact form ID"),
    status: z.enum(["pending", "in_progress", "resolved", "closed"]),
    priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
    admin_notes: z.string().optional(),
});

export const contactFormAssignmentSchema = z.object({
    id: z.number().positive("Invalid contact form ID"),
    assigned_to: z.string().uuid("Invalid user ID"),
});
```

### Step 3: Create Server Actions

```javascript
// app/action/contactFormAction.js
"use server";

import { auth } from "@lib/auth";
import { ContactForm, User, Role } from "@lib/models";
import {
    contactFormSchema,
    contactFormStatusSchema,
} from "@lib/zod/contactFormSchema";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { sendNotificationAndEmail } from "@lib/notificationEmail.utils";
import { Op } from "sequelize";

export async function storeContactForm(formData) {
    console.log("storeContactForm formData received:", formData);

    const parsed = contactFormSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Please check your input and try again.",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    try {
        const newContactForm = await ContactForm.create(data);

        // Notify all admins about new contact form
        (async () => {
            try {
                const adminRole = await Role.findOne({
                    where: { role_name: "Admin" },
                });

                if (adminRole) {
                    const adminUsers = await User.findAll({
                        include: [
                            {
                                model: Role,
                                as: "roles",
                                where: { id: adminRole.id },
                                through: { attributes: [] },
                            },
                        ],
                    });

                    if (adminUsers.length > 0) {
                        await sendNotificationAndEmail({
                            userIds: adminUsers.map((a) => a.id),
                            notificationData: {
                                subject: "New Contact Form Submission",
                                message: `New contact form submitted by ${data.name} (${data.email}) - Subject: ${data.subject}`,
                                type: "CONTACT_FORM",
                                reference_id: newContactForm.id,
                                created_by: null, // System generated
                            },
                        });
                    }
                }
            } catch (err) {
                console.error("Admin notification failed:", err);
            }
        })();

        return {
            success: true,
            data: newContactForm.get({ plain: true }),
            message:
                "Your message has been sent successfully. We'll get back to you soon.",
        };
    } catch (err) {
        console.error("storeContactForm error:", err);
        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function fetchContactForms() {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        const contactForms = await ContactForm.findAll({
            include: [
                {
                    model: User,
                    as: "assignedUser",
                    attributes: ["id", "first_name", "last_name", "email"],
                },
                {
                    model: User,
                    as: "resolvedByUser",
                    attributes: ["id", "first_name", "last_name", "email"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return {
            success: true,
            data: contactForms,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: extractErrorMessage(error),
        };
    }
}

export async function updateContactFormStatus(formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;
    formData.resolved_by = user.id;

    const parsed = contactFormStatusSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Please check your input and try again.",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    try {
        const contactForm = await ContactForm.findByPk(data.id);

        if (!contactForm) {
            return {
                success: false,
                message: "Contact form not found.",
            };
        }

        const updateData = {
            status: data.status,
            priority: data.priority || contactForm.priority,
            admin_notes: data.admin_notes,
        };

        if (data.status === "resolved") {
            updateData.resolved_at = new Date();
            updateData.resolved_by = user.id;
        }

        const updatedContactForm = await contactForm.update(updateData);

        await logAuditTrail({
            userId: user.id,
            controller: "contact_forms",
            action: "UPDATE_STATUS",
            details: `Contact form status updated to "${data.status}" for ID: ${updatedContactForm.id}`,
        });

        return {
            success: true,
            data: updatedContactForm.get({ plain: true }),
            message: "Contact form status updated successfully.",
        };
    } catch (err) {
        console.error("updateContactFormStatus error:", err);
        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}
```

### Step 4: Refactor ContactForm Component

```jsx
// components/pages/ContactUs/ContactForm.jsx
"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { contactFormSchema } from "@lib/zod/contactFormSchema";
import { storeContactForm } from "@/action/contactFormAction";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { Button } from "@components/ui/button";
import { DisplayValidationErrors, FieldError } from "@components/form";
import {
    Send,
    CheckCircle,
    AlertCircle,
    User,
    Mail,
    Phone,
    MessageSquare,
} from "lucide-react";
import LoadingModal from "@components/layout/LoadingModal";
import notify from "@components/ui/notify";

export default function ContactForm() {
    const form = useForm({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (data) => {
            const response = await storeContactForm(data);
            if (!response.success) throw response;
            return response.data;
        },
        onSuccess: () => {
            notify({ message: "Your message has been sent successfully!" });
            form.reset();
        },
        onError: (error) => {
            if (error?.type === "validation" && error?.errorArr?.length) {
                // Handle validation errors
                error.errorArr.forEach((err) => {
                    notify({ error: true, message: err });
                });
            } else {
                notify({
                    error: true,
                    message:
                        error?.message ||
                        "Failed to send message. Please try again.",
                });
            }
        },
    });

    const subjects = [
        "General Inquiry",
        "Blood Donation Appointment",
        "Blood Drive Organization",
        "Emergency Blood Request",
        "Volunteer Opportunities",
        "Partnership Inquiry",
        "Technical Support",
        "Other",
    ];

    return (
        <section id="contact-form" className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Send Us a Message
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Have a question or need assistance? Fill out the form
                        below and we'll get back to you as soon as possible.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl border border-blue-200 dark:border-gray-600 p-8"
                >
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(mutate)}
                            className="space-y-6"
                        >
                            {/* Name and Email Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Full Name *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter your full name"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FieldError
                                                field={
                                                    form.formState.errors.name
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                Email Address *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="Enter your email address"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FieldError
                                                field={
                                                    form.formState.errors.email
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Phone and Subject Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                Phone Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="tel"
                                                    placeholder="Enter your phone number"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FieldError
                                                field={
                                                    form.formState.errors.phone
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject *</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a subject" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {subjects.map(
                                                        (subject, index) => (
                                                            <SelectItem
                                                                key={index}
                                                                value={subject}
                                                            >
                                                                {subject}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FieldError
                                                field={
                                                    form.formState.errors
                                                        .subject
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Message */}
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Message *
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                rows={6}
                                                placeholder="Please provide details about your inquiry..."
                                                className="w-full resize-none"
                                            />
                                        </FormControl>
                                        <FieldError
                                            field={
                                                form.formState.errors.message
                                            }
                                        />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <div className="flex items-center justify-between pt-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    * Required fields
                                </p>

                                <Button
                                    type="submit"
                                    disabled={
                                        !form.formState.isDirty || isPending
                                    }
                                    className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold flex items-center"
                                >
                                    {isPending ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Display all validation errors */}
                            <DisplayValidationErrors
                                errors={form.formState.errors}
                            />
                        </form>
                    </Form>
                </motion.div>

                {/* Additional Contact Options */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Prefer a Different Method?
                        </h3>
                        <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                            If you prefer to contact us directly, you can call
                            us or visit our office during business hours.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+639284795154"
                                className="btn btn-white btn-lg px-8 py-3 text-lg font-semibold text-teal-600 hover:bg-gray-100"
                            >
                                Call Us Now
                            </a>
                            <a
                                href="#contact-info"
                                className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold border-white text-white hover:bg-white hover:text-teal-600"
                            >
                                View Contact Info
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>

            <LoadingModal isLoading={isPending}>
                Processing your message...
            </LoadingModal>
        </section>
    );
}
```

## Testing Strategy

### 1. Form Validation Testing

-   Test all required fields
-   Test email format validation
-   Test message length limits
-   Test subject selection

### 2. Submission Testing

-   Test successful submission
-   Test error handling
-   Test loading states
-   Test form reset

### 3. Notification Testing

-   Test admin notifications
-   Test email delivery
-   Test notification types

### 4. Database Testing

-   Test data persistence
-   Test model associations
-   Test validation constraints

## Success Criteria

1. **Functional Form**: Form submits data to database successfully
2. **Validation**: Client and server-side validation working
3. **Notifications**: Admins receive notifications for new submissions
4. **Error Handling**: Proper error messages and recovery
5. **User Experience**: Smooth form interaction with loading states
6. **Accessibility**: Form meets WCAG guidelines
7. **Mobile Responsive**: Form works on all device sizes

## Future Enhancements

1. **Admin Dashboard**: Interface for managing contact forms
2. **Email Templates**: Customized email responses
3. **File Attachments**: Allow file uploads in contact forms
4. **Auto-Response**: Automatic acknowledgment emails
5. **Analytics**: Contact form submission analytics
6. **Integration**: Integration with help desk systems

## Implementation Timeline

-   **Phase 1**: Database & Model (1-2 hours)
-   **Phase 2**: Server Actions (2-3 hours)
-   **Phase 3**: Form Refactoring (2-3 hours)
-   **Phase 4**: Testing & Polish (1-2 hours)

**Total Estimated Time**: 6-10 hours
