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
                    include: [
                        {
                            model: sequelize.models.Role,
                            attributes: ["id", "role_name", "icon", "url"],
                            as: "roles",
                            through: { attributes: [] },
                        },
                    ],
                });
                if (!admin) return null;
                console.log(
                    "sign in credentials>>>>>>>>>>>>>>>>>>>",
                    admin.roles
                );
                const isValid = await admin.validPassword(password);
                console.log("Invalid Password");
                if (!isValid) return null;
                console.log("Valid Password");

                return {
                    id: admin.id,
                    name: admin?.name || admin?.full_name,
                    email: admin.email,
                    image: admin.image,
                    profile: admin.get({ plain: true }),
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
        async signIn({ user, account, profile, trigger }) {
            console.log("SignIn callback:", {
                trigger,
                user,
                account,
                profile,
            }); // Debug
            return true;
        },
        async jwt({ token, account, trigger, user, session }) {
            //re triggers after signIn
            console.log("jwt: trigger", trigger);
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
                                through: { attributes: [] },
                            },
                        ],
                    });
                    token.name = admin?.name || admin?.full_name;
                    token.profile = JSON.parse(JSON.stringify(admin));
                    token.role_name = "";
                    if (admin?.roles?.length && admin?.roles?.length == 1) {
                        token.role_name = admin?.roles[0].role_name;
                    }
                } else {
                    /* signIn using Credentials */
                    const { roles } = user.profile;
                    token.role_name = "";
                    if (roles?.length && roles.length == 1) {
                        token.role_name = roles[0].role_name;
                    }
                    token.id = user.id;
                    token.profile = user.profile;
                }
                token.provider = account.provider;
            }

            if (trigger === "update") {
                console.log("update trigger", session);
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
            console.log("AuthJS callback session token", token);
            // console.log("calback session user", user);

            session.user.id = token?.id;
            session.user.gender = token?.profile?.gender;
            session.user.role_name = token?.role_name;
            session.user.roles = token?.profile?.roles;

            return session;
        },
    },
    // debug: process.env.NODE_ENV !== "production",
});
