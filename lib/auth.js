import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { adapter } from "@lib/models";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub({
            allowDangerousEmailAccountLinking: true,
        }),
        Google({
            allowDangerousEmailAccountLinking: true,
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials;

                const { Admin, File } = await import("@lib/models/index");

                const admin = await Admin.findOne({
                    where: { email },
                    attributes: [
                        "id",
                        "first_name",
                        "last_name",
                        "gender",
                        "email",
                        "password",
                    ],
                    include: [
                        {
                            attributes: ["id", "url", "type"],
                            model: File,
                            required: false,
                        },
                    ],
                });
                if (!admin) return null;
                console.log("admin>>>>>>>>>>>>>>>>>>>", admin);
                const isValid = await admin.validPassword(password);

                if (!isValid) return null;

                return {
                    id: admin.id,
                    name: admin.full_name,
                    email: admin.email,
                    gender: admin.gender,
                    avatar: {
                        url: admin?.File?.url || null,
                        type: admin?.File?.type || null,
                    },
                };
            },
        }),
    ],
    adapter,
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/", // your custom login page (optional)
        error: '/auth/error',
    },
    session: {
        strategy: 'database',
        maxAge: 30 * 24 * 60 * 60,
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: false,
                maxAge: undefined,
            },
        },
    },
    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id;
            return session;
        },
        async signIn({ user, account, profile }) {
            console.log('SignIn callback:', { user, account, profile }); // Debug
            return true;
        },
    },
    debug: true,
});
