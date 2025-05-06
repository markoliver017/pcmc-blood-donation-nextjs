import { Geist, Geist_Mono } from "next/font/google";
import "@/globals.css";

// import { Button } from "@components/ui/button";
import Sidebar from "@components/layout/Sidebar";
import Header from "@components/layout/Header";
import WrapperHead from "@components/layout/WrapperHead";
import Footer from "@components/layout/Footer";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import Preloader from "@components/layout/Preloader";
import Providers from "./AuthProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Inmerse Portal",
    description: "Integrated National Medication Error Reporting System",
    icons: {
        icon: "/favicon.ico", // /public path
    },
};

export default async function RootLayout({ children }) {
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
                            <Sidebar />
                            <div
                                id="main-container"
                                className="flex flex-col flex-1 h-screen overflow-y-scroll"
                            >
                                <Header />
                                <WrapperHead />
                                <main className="flex-1 p-4">{children}</main>
                                <Footer />
                            </div>
                        </div>
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    );
}
