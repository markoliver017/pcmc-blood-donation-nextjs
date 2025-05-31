import { Geist, Geist_Mono } from "next/font/google";
import "@/globals.css";

// import { Button } from "@components/ui/button";
import Sidebar from "@components/layout/Sidebar";
import HeaderNav from "@components/layout/HeaderNav";
import WrapperHead from "@components/layout/WrapperHead";
import Footer from "@components/layout/Footer";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import Preloader from "@components/layout/Preloader";
import Providers from "../../components/layout/AuthProvider";
import Header from "@components/layout/Header";
import { auth } from "@lib/auth";
import TansactProviders from "@components/layout/TansactProvider";
import ModalComponent from "./ModalComponent";
import { headers } from "next/headers";

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

export default async function RootLayout({ children, organizers }) {
    const session = await auth();
    console.log("Root layout", session);

    const headerList = await headers();
    const pathname = headerList.get("x-current-path");
    console.log("Root layout pathname", pathname);

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
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>
                    <ToastContainer />
                    <Preloader />
                    <ThemeProvider>
                        <div className="flex dark:bg-black dark:text-slate-100">
                            <Sidebar currentUser={currentUser} />
                            <div
                                id="main-container"
                                className="flex flex-col flex-1 h-screen overflow-y-scroll"
                            >
                                <HeaderNav currentUser={currentUser} />
                                {/* <Header /> */}
                                {/* <WrapperHead /> */}
                                <TansactProviders>
                                    <main className="flex-1">
                                        {/* <ModalComponent>{modal}</ModalComponent> */}
                                        {organizers}
                                        {children}
                                    </main>
                                </TansactProviders>
                                <Footer />
                            </div>
                        </div>
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    );
}
