import { z } from "zod";

// Schema for requesting password reset
export const requestPasswordResetSchema = z.object({
    email: z.string()
        .email("Please enter a valid email address")
        .min(1, "Email is required"),
});

// Schema for validating reset token
export const validateResetTokenSchema = z.object({
    token: z.string()
        .min(1, "Token is required")
        .regex(/^[a-f0-9]{64}$/, "Invalid token format"),
});

// Schema for resetting password
export const resetPasswordSchema = z.object({
    token: z.string()
        .min(1, "Token is required")
        .regex(/^[a-f0-9]{64}$/, "Invalid token format"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(128, "Password must be less than 128 characters")
        .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
        .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
        .regex(/^(?=.*\d)/, "Password must contain at least one number")
        .regex(/^(?=.*[@$!%*?&])/, "Password must contain at least one special character (@$!%*?&)"),
    confirmPassword: z.string()
        .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Schema for forgot password form
export const forgotPasswordFormSchema = z.object({
    email: z.string()
        .email("Please enter a valid email address")
        .min(1, "Email is required"),
});

// Schema for new password form
export const newPasswordFormSchema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(128, "Password must be less than 128 characters")
        .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
        .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
        .regex(/^(?=.*\d)/, "Password must contain at least one number")
        .regex(/^(?=.*[@$!%*?&])/, "Password must contain at least one special character (@$!%*?&)"),
    confirmPassword: z.string()
        .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Password strength validation helper
export const validatePasswordStrength = (password) => {
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[@$!%*?&]/.test(password),
    };

    const strength = Object.values(checks).filter(Boolean).length;
    
    return {
        isValid: strength >= 4,
        strength,
        checks,
        message: strength < 4 ? "Password is too weak" : "Password is strong",
    };
}; 