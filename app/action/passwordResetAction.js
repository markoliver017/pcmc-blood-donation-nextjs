"use server";

import { z } from "zod";
import crypto from "crypto";
import { User, PasswordReset } from "@lib/models";
import { send_mail } from "@lib/mail.utils";
import { getPasswordResetEmailTemplate } from "@lib/email-html-template/passwordResetEmailTemplate";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { logErrorToFile } from "@lib/logger.server";

// Zod schemas for validation
const requestPasswordResetSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

const validateResetTokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
});

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Request password reset
export async function requestPasswordReset(input) {
    try {
        const { email } = requestPasswordResetSchema.parse(input);

        // Find user by email
        const user = await User.findOne({ 
            where: { email: email.toLowerCase() },
            attributes: ["id", "email", "first_name", "last_name"]
        });

        if (!user) {
            // Don't reveal if user exists or not for security
            return {
                success: true,
                message: "If an account with that email exists, a password reset link has been sent.",
            };
        }

        // Generate secure random token
        const token = crypto.randomBytes(32).toString('hex');
        
        // Set expiration time (1 hour from now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        // Delete any existing reset tokens for this user
        await PasswordReset.destroy({
            where: { 
                user_id: user.id,
                used: false
            }
        });

        // Create new password reset record
        await PasswordReset.create({
            user_id: user.id,
            token,
            expires_at: expiresAt,
            used: false,
        });

        // Generate reset URL
        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${token}`;
        
        // Get user's name for email
        const userName = user.first_name || user.email.split('@')[0];

        // Send password reset email
        const emailResult = await send_mail({
            to: user.email,
            subject: "Password Reset Request - PCMC Pediatric Blood Center",
            html: getPasswordResetEmailTemplate(resetUrl, userName),
            text: `Hello ${userName},\n\nWe received a request to reset your password for your PCMC Pediatric Blood Center account.\n\nClick the following link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour for security reasons.\n\nIf you didn't request this password reset, please ignore this email.\n\nBest regards,\nPCMC Pediatric Blood Center Team`,
            user_id: user.id,
        });

        if (!emailResult.success) {
            logErrorToFile(`Failed to send password reset email to ${user.email}: ${emailResult.error}`, "PASSWORD_RESET");
            return {
                success: false,
                message: "Failed to send password reset email. Please try again later.",
            };
        }

        // Log audit trail
        try {
            await logAuditTrail({
                userId: user.id,
                controller: "password_reset",
                action: "REQUEST",
                details: `Password reset requested for email: ${user.email}`,
            });
        } catch (auditError) {
            console.error("Audit trail logging failed:", auditError);
        }

        return {
            success: true,
            message: "If an account with that email exists, a password reset link has been sent.",
        };

    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors;
            return {
                success: false,
                type: "validation",
                message: "Please check your input and try again.",
                errorObj: error.flatten().fieldErrors,
                errorArr: Object.values(fieldErrors).flat(),
            };
        }

        logErrorToFile(error, "PASSWORD_RESET_REQUEST");
        return {
            success: false,
            type: "server",
            message: "An error occurred while processing your request. Please try again later.",
        };
    }
}

// Validate reset token
export async function validateResetToken(input) {
    try {
        const { token } = validateResetTokenSchema.parse(input);

        // Find the password reset record
        const passwordReset = await PasswordReset.findOne({
            where: { 
                token,
                used: false,
                expires_at: { [require('sequelize').Op.gt]: new Date() }
            },
            include: [{
                model: User,
                as: "user",
                attributes: ["id", "email", "first_name", "last_name"]
            }]
        });

        if (!passwordReset) {
            return {
                success: false,
                message: "Invalid or expired password reset token.",
            };
        }

        return {
            success: true,
            data: {
                token,
                user: passwordReset.user,
            },
        };

    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors;
            return {
                success: false,
                type: "validation",
                message: "Please check your input and try again.",
                errorObj: error.flatten().fieldErrors,
                errorArr: Object.values(fieldErrors).flat(),
            };
        }

        logErrorToFile(error, "PASSWORD_RESET_VALIDATE");
        return {
            success: false,
            type: "server",
            message: "An error occurred while validating the token. Please try again later.",
        };
    }
}

// Reset password
export async function resetPassword(input) {
    try {
        const { token, password } = resetPasswordSchema.parse(input);

        // Find the password reset record
        const passwordReset = await PasswordReset.findOne({
            where: { 
                token,
                used: false,
                expires_at: { [require('sequelize').Op.gt]: new Date() }
            },
            include: [{
                model: User,
                as: "user",
                attributes: ["id", "email", "first_name", "last_name"]
            }]
        });

        if (!passwordReset) {
            return {
                success: false,
                message: "Invalid or expired password reset token.",
            };
        }

        // Update user's password
        await User.update(
            { password },
            { where: { id: passwordReset.user_id } }
        );

        // Mark the reset token as used
        await PasswordReset.update(
            { used: true },
            { where: { id: passwordReset.id } }
        );

        // Log audit trail
        try {
            await logAuditTrail({
                userId: passwordReset.user_id,
                controller: "password_reset",
                action: "SUCCESS",
                details: `Password successfully reset for user: ${passwordReset.user.email}`,
            });
        } catch (auditError) {
            console.error("Audit trail logging failed:", auditError);
        }

        return {
            success: true,
            message: "Your password has been successfully reset. You can now log in with your new password.",
        };

    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors;
            return {
                success: false,
                type: "validation",
                message: "Please check your input and try again.",
                errorObj: error.flatten().fieldErrors,
                errorArr: Object.values(fieldErrors).flat(),
            };
        }

        logErrorToFile(error, "PASSWORD_RESET");
        return {
            success: false,
            type: "server",
            message: "An error occurred while resetting your password. Please try again later.",
        };
    }
}

// Cleanup expired tokens (can be run as a cron job)
export async function cleanupExpiredTokens() {
    try {
        const deletedCount = await PasswordReset.destroy({
            where: {
                [require('sequelize').Op.or]: [
                    { expires_at: { [require('sequelize').Op.lt]: new Date() } },
                    { used: true }
                ]
            }
        });

        console.log(`Cleaned up ${deletedCount} expired password reset tokens`);
        return { success: true, deletedCount };
    } catch (error) {
        logErrorToFile(error, "PASSWORD_RESET_CLEANUP");
        return { success: false, error: error.message };
    }
} 