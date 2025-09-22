import React, { useEffect } from "react";
import { useSocket } from "./SocketProvider";
import { Bell } from "lucide-react";
import notify from "@components/ui/notify";
import { playBeep } from "@lib/utils/sound.utils";

export default function NewNotificationSockets() {
    const { socket, user } = useSocket();

    const sendNotification = () => {
        if (!socket) return;

        playBeep();

        socket.emit("send_notification", {
            type: "info",
            title: "New Notification",
            message: "Notification Message!",
            sender: user?.name || "Admin",
            targetUserId: "b284b85b-cda1-4f98-9804-08563b0a06c9",
        });
    };

    useEffect(() => {
        if (!socket) return;

        socket.on("new_notification", (data) => {
            console.log("New Notification:", data);
            notify(
                {
                    error: false,
                    message: (
                        <div>
                            <h3>{data?.subject}</h3>
                            <p>{data?.message}</p>
                        </div>
                    ),
                },
                data?.type || "info"
            );
            playBeep();
        });

        return () => {
            socket.off("new_notification");
        };
    }, [socket]);

    return (
        <div>
            <button
                className="btn btn-xs btn-primary"
                onClick={sendNotification}
            >
                <Bell size={16} />
            </button>
        </div>
    );
}
