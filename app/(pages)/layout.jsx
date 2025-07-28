import { Geist, Geist_Mono } from "next/font/google";
import "@/globals.css";

// import { Button } from "@components/ui/button";
import Sidebar from "@components/layout/Sidebar";
import HeaderNav from "@components/layout/HeaderNav";
import Footer from "@components/layout/Footer";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import Preloader from "@components/layout/Preloader";
import Providers from "../../components/layout/AuthProvider";
import TansactProviders from "@components/layout/TansactProvider";

import MainWrapper from "@components/layout/MainWrapper";
import BackToTop from "@components/pages/shared/BackToTop";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "PCMC PedBC MBD",
    description: "PCMC - Pediatric Blood Center - Medical Blood Donation",
    icons: {
        icon: "/favicon.ico", // /public path
    },
};

export default async function RootLayout({ children, rootLayoutModal }) {
    // const session = await auth();

    // let className = "";
    // const headerList = await headers();
    // const pathname = headerList.get("x-current-path");
    // // console.log("Root layout pathname", pathname);
    // if (pathname.startsWith("/portal/change-role")) {
    //     className = "bg-[url('/change-role-bg.jpg')] bg-cover bg-center bg-no-repeat bg-fixed";
    // }
    let currentUser = {
        name: "Bonnie Green",
        email: "admin@email.com",
        image: "https://avatar.iran.liara.run/public/boy",
        gender: "unknown",
    };
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-y-hidden`}
            >
                {/* This is the AuthProvider (next-auth) that wraps the entire app */}
                <Providers>
                    <ToastContainer containerId="main" />

                    {/* next-theme */}
                    <ThemeProvider>
                        <TansactProviders>
                            <div className="flex dark:bg-black dark:text-slate-100">
                                <Sidebar currentUser={currentUser} />

                                <MainWrapper>
                                    {/* <Preloader /> */}
                                    <HeaderNav currentUser={currentUser} />
                                    {/* <Header /> */}
                                    {/* <WrapperHead /> */}
                                    <main className="flex-1 ">
                                        {rootLayoutModal}
                                        {children}
                                    </main>
                                    <Footer />
                                    <BackToTop />
                                </MainWrapper>
                            </div>
                        </TansactProviders>
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    );
}
