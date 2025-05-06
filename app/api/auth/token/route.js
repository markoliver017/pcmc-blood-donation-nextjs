// /app/api/auth/token/route.js
import { getToken } from "next-auth/jwt";

export async function GET(req) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    return Response.json(token);
}
