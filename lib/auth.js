import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { adapter, sequelize } from "@lib/models";
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
                const models = sequelize.models;
                // console.log("modelsssssssssssssssssss", models);
                const { email, password } = credentials;

                const { user } = models;

                const admin = await user.findOne({
                    where: { email },
                    attributes: [
                        "id",
                        "name",
                        "image",
                        "email",
                        "first_name",
                        "last_name",
                        "gender",
                        "password",
                    ],
                });
                if (!admin) return null;
                // console.log("sign in credentials>>>>>>>>>>>>>>>>>>>", admin);
                const isValid = await admin.validPassword(password);

                if (!isValid) return null;

                return {
                    id: admin.id,
                    name: admin.full_name,
                    email: admin.email,
                    image: admin.image,
                    profile: {
                        gender: admin.gender,
                        first_name: admin.first_name,
                        last_name: admin.last_name,
                    },
                };
            },
        }),
    ],
    adapter,
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/", // your custom login page (optional)
        error: "/auth/error",
    },
    session: {
        // strategy: "database",
        strategy: "jwt",
        maxAge: 60 * 15,
        refetchInterval: 0,
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
        async signIn({ user, account, profile }) {
            console.log("SignIn callback:", { user, account, profile }); // Debug
            return true;
        },
        async jwt({ token, account, trigger, user, session }) {
            //re triggers after signIn
            // console.log("jwt: trigger", trigger);
            // console.log(`jwt: token`, token);
            // console.log("jwt: user", user); //from the db or provider
            // console.log("jwt: session", session); //from the client page
            // console.log("Calbacks jwt>>>>>>>>>>>");
            // console.log("jwt: account,", account);
            // console.log("jwt: profile", profile); //from the client page
            // console.log("\n\n\n ");

            if (trigger == "signIn") {
                if (account.provider != "credentials") {
                    const models = sequelize.models;
                    const { user: Admin } = models;
                    const admin = await Admin.findOne({
                        where: { email: user.email },
                        attributes: [
                            "id",
                            "image",
                            "email",
                            "first_name",
                            "last_name",
                            "full_name",
                            "gender",
                        ],
                    });
                    token.name = admin.full_name;
                    token.profile = JSON.parse(JSON.stringify(admin));
                } else {
                    token.id = user.id;
                    token.profile = user.profile;
                }
                token.provider = account.provider;
            }

            if (trigger === "update") {
                if (session?.name) token.name = session.name;
                if (session?.image) token.picture = session.image;
                if (session?.profile) token.profile = session.profile;
                if (session?.email) token.email = session.email;
            }

            return token;
        },
        async session({ session, token }) {
            // console.log("callback session session", session);
            // console.log("calback session token", token);
            // console.log("calback session user", user);
            session.user.id = token?.id;
            session.user.gender = token?.profile?.gender;
            return session;
        },
    },
    // debug: process.env.NODE_ENV !== "production",
});
