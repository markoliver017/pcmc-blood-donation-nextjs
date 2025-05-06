import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { Admin, File } from "@lib/models"; // Adjust to your actual model import

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
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
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/", // your custom login page (optional)
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 15,
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
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.uid = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.gender = token.uid?.gender;
            session.user.avatar = token.uid?.avatar?.url || null;
            return session;
        },
    },
});
