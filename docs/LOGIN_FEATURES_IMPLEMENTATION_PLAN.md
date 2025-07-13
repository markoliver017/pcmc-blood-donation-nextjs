# 🔐 Login Features Implementation Plan

## 🎯 **Project Overview**

Implementation of "Remember Me" functionality and "Forgot Password" feature for the PCMC Pediatric Blood Center login system, using existing SMTP utility and current tech stack.

---

## 🛠️ **Current Tech Stack Analysis**

Based on README.md and existing code:

-   **Framework**: Next.js 15 with App Router
-   **Database**: MySQL with Sequelize ORM
-   **Authentication**: NextAuth.js with role-based access control
-   **UI**: Tailwind CSS + shadcn/ui + DaisyUI
-   **State Management**: TanStack Query (React Query)
-   **Forms**: React Hook Form with Zod validation
-   **Email**: Nodemailer with Gmail SMTP (existing `mail.utils.js`)

---

## 🔄 **Feature 1: Remember Me Functionality**

### **Backend Implementation**

#### **Step 1: Update User Model**

-   [ ] Add `remember_token` field to User model
-   [ ] Add `remember_token_expires` field for token expiration
-   [ ] Update UserModel.js with new fields

#### **Step 2: Create Remember Me Server Actions**

-   [ ] Create `app/action/authAction.js` with:
    -   `generateRememberToken()` - Generate secure random token
    -   `setRememberToken(userId, token)` - Store token in database
    -   `validateRememberToken(token)` - Validate stored token
    -   `clearRememberToken(userId)` - Remove token on logout

#### **Step 3: Update NextAuth Configuration**

-   [ ] Modify `lib/auth.js` to handle remember me tokens
-   [ ] Add JWT callback to include remember token
-   [ ] Add session callback to extend session duration
-   [ ] Update credentials provider to check remember token

#### **Step 4: Database Migration**

-   [ ] Create migration file: `migrations/add_remember_token_to_users.js`
-   [ ] Add `remember_token` (VARCHAR(255), nullable)
-   [ ] Add `remember_token_expires` (DATETIME, nullable)
-   [ ] Add indexes for performance

### **Frontend Implementation**

#### **Step 5: Update LoginForm Component**

-   [ ] Modify `components/login/LoginForm.jsx`
-   [ ] Add state for remember me checkbox
-   [ ] Update form submission to include remember me preference
-   [ ] Add visual feedback for remember me selection

#### **Step 6: Auto-Login Logic**

-   [ ] Create `components/auth/AutoLogin.jsx` component
-   [ ] Check for remember token on app load
-   [ ] Automatically sign in user if valid token exists
-   [ ] Handle token expiration gracefully

---

## 🔑 **Feature 2: Forgot Password Functionality**

### **Backend Implementation**

#### **Step 1: Create Password Reset Models**

-   [ ] Create `lib/models/PasswordResetModel.js`
-   [ ] Fields: `id`, `user_id`, `token`, `expires_at`, `used`, `created_at`
-   [ ] Add to models index and create migration

#### **Step 2: Create Password Reset Server Actions**

-   [ ] Create `app/action/passwordResetAction.js` with:
    -   `requestPasswordReset(email)` - Generate reset token and send email
    -   `validateResetToken(token)` - Validate reset token
    -   `resetPassword(token, newPassword)` - Update password and invalidate token
    -   `cleanupExpiredTokens()` - Remove expired tokens

#### **Step 3: Email Templates**

-   [ ] Create `lib/email-html-template/passwordResetEmailTemplate.js`
-   [ ] Design responsive HTML email template
-   [ ] Include reset link with token
-   [ ] Add PCMC branding and styling

#### **Step 4: Update Mail Utility**

-   [ ] Enhance `lib/mail.utils.js` if needed
-   [ ] Add password reset email function
-   [ ] Ensure proper error handling

### **Frontend Implementation**

#### **Step 5: Create Forgot Password Page**

-   [ ] Create `app/(pages)/auth/forgot-password/page.jsx`
-   [ ] Design form with email input
-   [ ] Add validation using React Hook Form + Zod
-   [ ] Include loading states and success/error messages

#### **Step 6: Create Reset Password Page**

-   [ ] Create `app/(pages)/auth/reset-password/[token]/page.jsx`
-   [ ] Design password reset form
-   [ ] Add password strength validation
-   [ ] Handle token validation and password update

#### **Step 7: Update LoginForm Component**

-   [ ] Add "Forgot Password?" link
-   [ ] Link to forgot password page
-   [ ] Update styling to match existing design

---

## 📋 **Detailed Implementation Steps**

### **Phase 1: Remember Me Feature**

#### **Step 1.1: Database Schema Updates**

```sql
-- Migration: add_remember_token_to_users.js
ALTER TABLE users
ADD COLUMN remember_token VARCHAR(255) NULL,
ADD COLUMN remember_token_expires DATETIME NULL,
ADD INDEX idx_remember_token (remember_token),
ADD INDEX idx_remember_token_expires (remember_token_expires);
```

#### **Step 1.2: User Model Updates**

```javascript
// lib/models/UserModel.js
remember_token: {
    type: DataTypes.STRING(255),
    allowNull: true,
},
remember_token_expires: {
    type: DataTypes.DATE,
    allowNull: true,
},
```

#### **Step 1.3: Auth Actions**

```javascript
// app/action/authAction.js
export async function generateRememberToken() {
    return crypto.randomBytes(32).toString("hex");
}

export async function setRememberToken(userId, token) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // 30 days

    await User.update(
        {
            remember_token: token,
            remember_token_expires: expires,
        },
        {
            where: { id: userId },
        }
    );
}
```

#### **Step 1.4: NextAuth Configuration**

```javascript
// lib/auth.js
callbacks: {
    jwt: async ({ token, user }) => {
        if (user) {
            token.rememberToken = user.rememberToken;
        }
        return token;
    },
    session: async ({ session, token }) => {
        if (token.rememberToken) {
            session.rememberToken = token.rememberToken;
        }
        return session;
    }
}
```

### **Phase 2: Forgot Password Feature**

#### **Step 2.1: Password Reset Model**

```javascript
// lib/models/PasswordResetModel.js
const PasswordResetModel = (sequelize, DataTypes) => {
    const PasswordReset = sequelize.define(
        "PasswordReset",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            token: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            expires_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            used: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            timestamps: true,
            tableName: "password_resets",
        }
    );

    PasswordReset.associate = (models) => {
        PasswordReset.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
        });
    };

    return PasswordReset;
};
```

#### **Step 2.2: Password Reset Actions**

```javascript
// app/action/passwordResetAction.js
export async function requestPasswordReset(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return { success: false, message: "User not found" };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    await PasswordReset.create({
        user_id: user.id,
        token,
        expires_at: expiresAt,
    });

    // Send email using existing mail utility
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${token}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    return { success: true, message: "Password reset email sent" };
}
```

#### **Step 2.3: Email Template**

```javascript
// lib/email-html-template/passwordResetEmailTemplate.js
export function getPasswordResetEmailTemplate(resetUrl, userName) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
                <h1>PCMC Pediatric Blood Center</h1>
                <h2>Password Reset Request</h2>
            </div>
            <div style="padding: 20px; background: #f9fafb;">
                <p>Hello ${userName},</p>
                <p>We received a request to reset your password for your PCMC Pediatric Blood Center account.</p>
                <p>Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background: #dc2626; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p>This link will expire in 1 hour for security reasons.</p>
                <p>If you didn't request this password reset, please ignore this email.</p>
                <p>Best regards,<br>PCMC Pediatric Blood Center Team</p>
            </div>
        </div>
    `;
}
```

---

## 🎨 **UI/UX Design Specifications**

### **Remember Me Checkbox**

-   [ ] Use existing DaisyUI checkbox styling
-   [ ] Position below password field
-   [ ] Add subtle animation on hover
-   [ ] Include tooltip explaining functionality

### **Forgot Password Link**

-   [ ] Position below login form
-   [ ] Use muted text color with hover effect
-   [ ] Add arrow icon for better UX
-   [ ] Responsive design for mobile

### **Password Reset Pages**

-   [ ] Consistent with existing login form design
-   [ ] Use same color scheme and branding
-   [ ] Include PCMC logo and styling
-   [ ] Mobile-responsive layout

---

## 🔒 **Security Considerations**

### **Remember Me Security**

-   [ ] Use cryptographically secure random tokens
-   [ ] Set reasonable expiration time (30 days)
-   [ ] Store tokens securely in database
-   [ ] Implement token rotation on password change

### **Password Reset Security**

-   [ ] Use secure random tokens (32 bytes)
-   [ ] Set short expiration time (1 hour)
-   [ ] One-time use tokens
-   [ ] Rate limiting for reset requests
-   [ ] Audit logging for security events

### **General Security**

-   [ ] Input validation and sanitization
-   [ ] CSRF protection
-   [ ] Rate limiting on auth endpoints
-   [ ] Secure session management
-   [ ] Audit trail logging

---

## 🧪 **Testing Strategy**

### **Unit Tests**

-   [ ] Test token generation and validation
-   [ ] Test email sending functionality
-   [ ] Test password reset flow
-   [ ] Test remember me persistence

### **Integration Tests**

-   [ ] Test complete login flow with remember me
-   [ ] Test password reset end-to-end
-   [ ] Test token expiration handling
-   [ ] Test concurrent session management

### **Security Tests**

-   [ ] Test token brute force protection
-   [ ] Test rate limiting effectiveness
-   [ ] Test session hijacking prevention
-   [ ] Test CSRF protection

---

## 📊 **Database Schema Changes**

### **Users Table Updates**

```sql
ALTER TABLE users
ADD COLUMN remember_token VARCHAR(255) NULL,
ADD COLUMN remember_token_expires DATETIME NULL;
```

### **New Password Resets Table**

```sql
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id UUID NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);
```

---

## 🚀 **Deployment Checklist**

### **Pre-Deployment**

-   [ ] Run database migrations
-   [ ] Update environment variables
-   [ ] Test email functionality
-   [ ] Verify SMTP configuration
-   [ ] Test on staging environment

### **Post-Deployment**

-   [ ] Monitor email delivery rates
-   [ ] Check error logs for auth issues
-   [ ] Monitor database performance
-   [ ] Verify security measures
-   [ ] Test user flows

---

## 📝 **Documentation Updates**

### **User Documentation**

-   [ ] Update user guide with new features
-   [ ] Create password reset instructions
-   [ ] Document remember me functionality
-   [ ] Add troubleshooting section

### **Developer Documentation**

-   [ ] Update API documentation
-   [ ] Document new database schema
-   [ ] Add security considerations
-   [ ] Update deployment guide

---

**Version:** 1.0.0  
**Created:** January 2025  
**Status:** Planning  
**Priority:** High
