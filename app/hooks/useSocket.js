import { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";

// Custom hook for Socket.IO connection and management
export const useSocket = (serverURL = process.env.NEXT_PUBLIC_SOCKET_URL) => {
    // State to track connection status
    const [isConnected, setIsConnected] = useState(false);
    // State to store received notifications
    const [notifications, setNotifications] = useState([]);
    // State to store real-time updates
    const [updates, setUpdates] = useState([]);
    // State to track online users
    // const [onlineUsers, setOnlineUsers] = useState([]);

    // Ref to store socket instance (persists across re-renders)
    const socketRef = useRef(null);
    // Ref to store user data
    const userRef = useRef(null);

    // Initialize socket connection
    useEffect(() => {
        // Create socket connection with configuration
        socketRef.current = io(serverURL, {
            transports: ["websocket"], // Use WebSocket transport only
            upgrade: true, // Allow transport upgrades
            rememberUpgrade: true, // Remember the upgrade for next time
        });

        const socket = socketRef.current;

        // Connection event handlers
        socket.on("connect", () => {
            console.log("Connected to Socket.IO server:", socket.id);
            setIsConnected(true);
        });

        socket.on("disconnect", (reason) => {
            console.log("Disconnected from Socket.IO server:", reason);
            setIsConnected(false);
        });

        // Authentication response handler
        socket.on("authenticated", (data) => {
            console.log("Authentication successful:", data);
        });

        // Notification handler - adds new notifications to state
        socket.on("notification", (notification) => {
            console.log("New notification received:", notification);
            setNotifications((prev) => [notification, ...prev]);
        });

        // Data update handler - adds new updates to state
        socket.on("data_updated", (update) => {
            console.log("Data update received:", update);
            setUpdates((prev) => [update, ...prev]);
        });

        // User joined room handler
        socket.on("user_joined", (data) => {
            console.log("User joined room:", data);
            // Update online users list or show notification
        });

        // User left room handler
        socket.on("user_left", (data) => {
            console.log("User left room:", data);
            // Update online users list
        });

        // Connection error handler
        socket.on("error_occurred", (error) => {
            console.error("Socket error:", error);
        });

        // Cleanup function - runs when component unmounts
        return () => {
            if (socket) {
                socket.disconnect(); // Close the connection
            }
        };
    }, [serverURL]);

    // Function to authenticate user with the socket server
    const authenticate = useCallback(
        (userData) => {
            if (socketRef.current && isConnected) {
                userRef.current = userData;
                socketRef.current.emit("authenticate", userData);
            }
        },
        [isConnected]
    );

    // Function to join a room
    const joinRoom = useCallback(
        (roomName) => {
            if (socketRef.current && isConnected) {
                socketRef.current.emit("join_room", roomName);
            }
        },
        [isConnected]
    );

    // Function to leave a room
    const leaveRoom = useCallback(
        (roomName) => {
            if (socketRef.current && isConnected) {
                socketRef.current.emit("leave_room", roomName);
            }
        },
        [isConnected]
    );

    // Function to send a notification
    const sendNotification = useCallback(
        (notificationData) => {
            if (socketRef.current && isConnected) {
                socketRef.current.emit("send_notification", notificationData);
            }
        },
        [isConnected]
    );

    // Function to send data updates
    const sendUpdate = useCallback(
        (updateData) => {
            if (socketRef.current && isConnected) {
                socketRef.current.emit("data_update", updateData);
            }
        },
        [isConnected]
    );

    // Function to send messages
    const sendMessage = useCallback(
        (messageData) => {
            if (socketRef.current && isConnected) {
                socketRef.current.emit("send_message", messageData);
            }
        },
        [isConnected]
    );

    // Function to clear notifications
    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    // Function to clear updates
    const clearUpdates = useCallback(() => {
        setUpdates([]);
    }, []);

    // Return all socket functionality and state
    return {
        socket: socketRef.current,
        isConnected,
        notifications,
        updates,
        // onlineUsers,
        authenticate,
        joinRoom,
        leaveRoom,
        sendNotification,
        sendUpdate,
        sendMessage,
        clearNotifications,
        clearUpdates,
    };
};
