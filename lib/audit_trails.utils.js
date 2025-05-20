"use server";

import { headers } from "next/headers";
import { AuditTrail } from "./models";

export async function logAuditTrail({ userId, controller, action, details }) {
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for") || "Unknown";
    const userAgent = hdrs.get("user-agent") || "Unknown";

    try {
        await AuditTrail.create({
            user_id: userId,
            controller,
            action,
            is_error: false,
            details,
            ip_address: ip,
            user_agent: userAgent,
            stack_trace: null,
        });
    } catch (error) {
        await AuditTrail.create({
            user_id: userId,
            controller,
            action,
            is_error: true,
            details,
            ip_address: ip,
            user_agent: userAgent,
            stack_trace: error.stack || "No stack trace",
        });
    }
}

// await logAuditTrail({
//   userId: session.user.id,
//   controller: 'posts',
//   action: 'CREATE',
//   details: "A new post has been successfully created",
// });
