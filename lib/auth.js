import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { adapter, sequelize } from "@lib/models";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { formatSeqObj } from "./utils/object.utils";

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
                debugEmail: { label: "Debug Email", type: "text" },
            },
            async authorize(credentials) {
                const models = sequelize.models;

                if (credentials?.debugEmail) {
                    // Debug mode logic
                    console.log("Debug mode enabled with email:", credentials.debugEmail);
                    const admin = await models.user.findOne({
                        where: { email: credentials.debugEmail },
                        attributes: [
                            "id",
                            "image",
                            "email",
                            "name",
                            "first_name",
                            "middle_name",
                            "last_name",
                            "full_name",
                            "gender",
                            "password",
                        ],
                        include: [
                            {
                                model: sequelize.models.Role,
                                attributes: ["id", "role_name", "icon", "url"],
                                as: "roles",
                                through: {
                                    // where: { is_active: true },
                                    attributes: ["is_active"],
                                    as: "role",
                                },
                            },
                        ],
                    });
                    console.log("Debug mode enabled with admin:", admin);
                    if (!admin) return null;
                    return {
                        id: admin.id,
                        name: admin.name,
                        email: admin.email,
                        profile: admin.get({ plain: true }),
                    };
                } else {

                    const { email, password } = credentials;

                    const { user } = models;

                    const admin = await user.findOne({
                        where: { email },
                        attributes: [
                            "id",
                            "image",
                            "email",
                            "name",
                            "first_name",
                            "middle_name",
                            "last_name",
                            "full_name",
                            "gender",
                            "password",
                        ],
                        include: [
                            {
                                model: sequelize.models.Role,
                                attributes: ["id", "role_name", "icon", "url"],
                                as: "roles",
                                through: {
                                    // where: { is_active: true },
                                    attributes: ["is_active"],
                                    as: "role",
                                },
                            },
                        ],
                    });
                    // console.log("credentials provider", admin);
                    if (!admin) return null;

                    const isValid = await admin.validPassword(password);

                    if (!isValid) {
                        console.log("Invalid Password");
                        return null;
                    }

                    console.log("Valid Password");

                    return {
                        id: admin.id,
                        name: admin?.name || admin?.full_name,
                        email: admin.email,
                        image: admin.image,
                        profile: admin.get({ plain: true }),
                    };
                }

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
        refetchInterval: 60 * 15,
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
        async signIn({ user, account, profile, trigger }) {
            // console.log("SignIn callback:", {
            //     trigger,
            //     user,
            //     account,
            //     profile,
            // }); // Debug
            const admin = await sequelize.models.user.findOne({
                where: { email: user.email },
                attributes: ["id"],
                include: [
                    {
                        model: sequelize.models.Role,
                        attributes: ["id", "role_name"],
                        as: "roles",
                        through: { attributes: ["is_active"], as: "role" },
                    },
                ],
            });
            if (!admin) return `/auth/error?error=Email not registered!`;
            // console.log("signin admin callback", admin)

            if (!admin?.roles?.length)
                return "/auth/error?error=No user role found";
            // console.log("signin user roles", formatSeqObj(admin.roles));

            // const active_roles = admin.roles.some(
            //     (roles) => roles.role.is_active == 1
            // );
            // if (!active_roles) return "/auth/error?error=No active role found";

            console.log("Sigin successfully!");
            return true;
        },

        async jwt({ token, account, trigger, user, session }) {
            //re triggers after signIn
            // console.log("jwt: trigger", trigger);

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
                            "name",
                            "first_name",
                            "middle_name",
                            "last_name",
                            "full_name",
                            "gender",
                        ],
                        include: [
                            {
                                model: sequelize.models.Role,
                                attributes: ["id", "role_name", "icon", "url"],
                                as: "roles",
                                through: {
                                    // where: { is_active: true },
                                    attributes: ["is_active"],
                                    as: "role",
                                },
                            },
                        ],
                    });
                    token.name = admin?.name || admin?.full_name;
                    token.profile = JSON.parse(JSON.stringify(admin));
                    token.role_name = "";
                    if (admin?.roles?.length == 1) {
                        token.role_name = admin?.roles[0].role_name;
                    }
                } else {
                    /* signIn using Credentials */
                    const { roles } = user.profile;
                    token.role_name = "";

                    if (roles.length == 1) {
                        token.role_name = roles[0].role_name;
                    }
                    token.id = user.id;
                    token.profile = user.profile;
                }
                token.provider = account.provider;
            }

            if (trigger === "update") {
                // console.log("update trigger", session);
                if (session?.name) token.name = session.name;
                if (session?.image) token.picture = session.image;
                if (session?.gender) token.gender = session.gender;
                if (session?.email) token.email = session.email;
                if (session?.role_name) token.role_name = session.role_name;
                if (session?.action == "reset_role") token.role_name = "";
            }

            return token;
        },
        async session({ session, token }) {
            // console.log("callback session session", session);
            // console.log("AuthJS callback session token", token);
            // console.log("calback session user", user);

            session.user.id = token?.id;
            session.user.gender = token?.profile?.gender;
            session.user.role_name = token?.role_name;
            session.user.roles = token?.profile?.roles;
            session.user.provider = token?.provider;

            return session;
        },
    },
    // debug: process.env.NODE_ENV !== "production",
});
