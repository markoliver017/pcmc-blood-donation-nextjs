import { handlers } from "@lib/auth"; // Referring to the auth.ts we just created
export const { GET, POST } = handlers;

// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// // const CredentialsProvider = await import("next-auth/providers/credentials");
// import { Admin, File } from "@lib/models"; // Adjust to your actual model import

// export const authOptions = {
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "text" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials) {
//                 const { email, password } = credentials;
//                 const admin = await Admin.findOne({
//                     where: { email },
//                     attributes: [
//                         "id",
//                         "first_name",
//                         "last_name",
//                         "gender",
//                         "email",
//                         "password",
//                     ],
//                     include: [
//                         {
//                             attributes: ["id", "url", "type"],
//                             model: File,
//                             required: false,
//                         },
//                     ],
//                 });
//                 if (!admin) return null;
//                 const isValid = await admin.validPassword(password);
//                 if (!isValid) return null;
//                 return {
//                     id: admin.id,
//                     name: admin.full_name,
//                     email: admin.email,
//                     gender: admin.gender,
//                     avatar: {
//                         url: admin?.File?.url || null,
//                         type: admin?.File?.type || null,
//                     },
//                 };
//             },
//         }),
//     ],
//     pages: {
//         signIn: "/", // your custom login page (optional)
//     },
//     session: {
//         strategy: "jwt",
//     },
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id;
//                 token.name = user.name;
//                 token.email = user.email;
//                 token.uid = user;
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             session.user.id = token.id;
//             session.user.name = token.name;
//             session.user.email = token.email;
//             session.user.gender = token.uid?.gender;
//             session.user.avatar = token.uid?.avatar?.url || null;
//             return session;
//         },
//     },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
