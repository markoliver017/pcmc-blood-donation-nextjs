"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [newNotifications, setNewNotifications] = useState([]);
    const { data: session, status } = useSession();

    // console.log("SESSION: ", session);
    useEffect(() => {
        if (status === "loading") return; // Still loading session

        let socketConnection = null;

        if (session?.user) {
            // User is authenticated, create socket connection
            socketConnection = io(
                process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5050",
                {
                    auth: {
                        // Send NextAuth session data for authentication
                        token: session.accessToken || "no-token",
                        userId: session.user.id,
                        email: session.user.email,
                        name: session.user.name,
                    },
                    transports: ["websocket", "polling"],
                }
            );

            // Connection event handlers
            socketConnection.on("connect", () => {
                // console.log("Socket connected:", socketConnection.id);
                setIsConnected(true);

                // Authenticate with user data from NextAuth
                socketConnection.emit("authenticate", {
                    userId: session.user.id,
                    name: session.user.name || session.user.email,
                    email: session.user.email,
                    role: session?.user?.role_name,
                    image: session.user.image,
                    device: window.navigator.userAgent,
                });

                socketConnection.on("authenticated", (data) => {
                    setIsAuthenticated(data.status == "success");
                });

                socketConnection.on("connected_users", (data) => {
                    // console.log("Client Logs: Connected users:", data);
                    setConnectedUsers(data);
                });
            });

            socketConnection.on("disconnect", () => {
                // console.log("Socket disconnected");
                setIsConnected(false);
            });

            socketConnection.on("connect_error", (error) => {
                console.error("Socket connection error:", error);
                setIsConnected(false);
            });

            setSocket(socketConnection);
        } else {
            // User not authenticated, no socket connection
            setSocket(null);
            setIsConnected(false);
        }

        // Cleanup on unmount or session change
        return () => {
            if (socketConnection) {
                // Remove ALL listeners
                socketConnection.off("connect");
                socketConnection.off("disconnect");
                socketConnection.off("connect_error");
                socketConnection.off("authenticated");
                socketConnection.off("connected_users");

                // Then disconnect the socket
                socketConnection.disconnect();
            }
        };
    }, [session, status]);

    const value = {
        socket,
        isConnected,
        isAuthenticated,
        connectedUsers,
        user: session?.user,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
}
