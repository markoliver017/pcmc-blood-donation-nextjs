// middleware.ts or middleware.js
import { NextResponse } from 'next/server'
import { auth } from '@lib/auth'

// export default auth((req) => {
//     console.log("req.auth >>>>>>>>>>>>>>>", req.auth)
// })

// This is your secret from [...nextauth].ts config
// const secret = process.env.NEXTAUTH_SECRET

export async function middleware(request) {
    // const token = await getToken({ req: request, secret })
    const token = await auth();
    console.log("middleware token:", token)

    const { pathname } = request.nextUrl


    const isAdminRoute = pathname.startsWith('/admin');

    // Allow the request if it's not /admin or user is authenticated
    if (!isAdminRoute || token) {
        return NextResponse.next()
    }

    // If user is authenticated and visiting /login, redirect to /admin
    if (token && pathname === '/') {
        return NextResponse.redirect(new URL('/admin', request.url))
    }
    // If trying to access /admin and not authenticated, redirect
    const loginUrl = new URL('/', request.url)
    return NextResponse.redirect(loginUrl)
}

// See "Matching Paths" below to learn more
export const config = {
    // matcher: '/:path*',
    // matcher: '/',
    matcher: '/admin/:path*',
}

// export function middleware(request) {
//     if (request.nextUrl.pathname.startsWith('/about')) {
//         return NextResponse.rewrite(new URL('/about-2', request.url))
//     }

//     if (request.nextUrl.pathname.startsWith('/dashboard')) {
//         return NextResponse.rewrite(new URL('/dashboard/user', request.url))
//     }
// }