import { NextResponse } from "next/server";

export async function middleware(request) {
    const headers = new Headers(request.headers);
    headers.set("x-current-path", request.nextUrl.pathname);

    return NextResponse.next({ headers });
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:gif|png|jpg|jpeg|css|js)).*)",
    ],
};

// export default auth((req) => {
//     console.log("req.auth >>>>>>>>>>>>>>>", req.auth)
// })

// This is your secret from [...nextauth].ts config
// const secret = process.env.NEXTAUTH_SECRET

// matcher: "/:path*",
// // matcher: '/',
// matcher: '/admin/:path*',

// export function middleware(request) {
// const { pathname } = request.nextUrl;
//     console.log("middleware pathname", pathname);
//     if (request.nextUrl.pathname.startsWith('/about')) {
//         return NextResponse.rewrite(new URL('/about-2', request.url))
//     }

//     if (request.nextUrl.pathname.startsWith('/dashboard')) {
//         return NextResponse.rewrite(new URL('/dashboard/user', request.url))
//     }
// }
