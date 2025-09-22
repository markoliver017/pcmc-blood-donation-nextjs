"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck2 } from "lucide-react";

import { useSocket } from "@components/layout/SocketProvider";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@components/ui/popover";
import Image from "next/image";

export default function OnlineUsers() {
    const conn = useSocket();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (conn.isConnected && conn.connectedUsers.length > 0) {
            setIsVisible(true);
        }
    }, [conn.isConnected, conn.connectedUsers]);

    const { socket, connectedUsers, isAuthenticated, user } = conn;

    if (!isAuthenticated || !user || user?.role_name !== "Admin") return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <Popover>
                    <PopoverTrigger asChild>
                        <motion.button
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="relative w-12 h-12 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-full shadow-lg border-2 border-white dark:border-gray-800 flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-700"
                            aria-label={`See Online Users (${connectedUsers.length})`}
                            title={`Online Users: ${connectedUsers.length}`}
                            type="button"
                        >
                            <UserCheck2 className="w-6 h-6" />
                            {connectedUsers.length > 0 && (
                                <span className="pointer-events-none absolute -top-1 -right-1 inline-flex items-center justify-center text-[10px] font-semibold h-5 min-w-5 px-1.5 rounded-full bg-white text-green-700 border border-green-500/40 shadow-sm dark:bg-gray-900 dark:text-green-300">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-30 animate-ping"></span>
                                    <span className="relative">
                                        {connectedUsers.length > 99
                                            ? "99+"
                                            : connectedUsers.length}
                                    </span>
                                </span>
                            )}
                        </motion.button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-80 p-0 overflow-hidden shadow-xl border border-gray-200/70 dark:border-gray-800/70 rounded-xl"
                        side="bottom"
                    >
                        <div className="px-4 py-3 border-b bg-gray-50/80 dark:bg-gray-900/40 backdrop-blur-sm flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                    <UserCheck2 className="h-4 w-4" />
                                </span>
                                <span>Online Users</span>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20">
                                {connectedUsers.length}
                            </span>
                        </div>

                        <ul className="max-h-72 overflow-y-auto py-2">
                            {connectedUsers.map((u, index) => {
                                const isSelf =
                                    (u?.userData?.id &&
                                        u?.userData?.id === user?.id) ||
                                    (u?.userData?.email &&
                                        u?.userData?.email === user?.email);
                                const displayName =
                                    u?.userData?.name || "Unknown User";
                                const avatarSrc =
                                    u?.userData?.image || "/default_avatar.png";

                                return (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.15,
                                            delay: index * 0.02,
                                        }}
                                        className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Image
                                                    src={avatarSrc}
                                                    alt={displayName}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full border border-gray-200 dark:border-gray-800"
                                                    unoptimized={
                                                        process.env
                                                            .NEXT_PUBLIC_NODE_ENV ===
                                                        "production"
                                                    }
                                                />
                                                <span
                                                    className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900"
                                                    title="Online"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium truncate">
                                                    {displayName}
                                                    {isSelf && (
                                                        <span className="ml-2 text-[11px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 align-middle">
                                                            You
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Online now
                                                </p>
                                            </div>
                                        </div>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </PopoverContent>
                </Popover>
            )}
        </AnimatePresence>
    );
}
