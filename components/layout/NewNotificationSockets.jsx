import React, { useEffect } from "react";
import { useSocket } from "./SocketProvider";
import { Bell } from "lucide-react";
import notify from "@components/ui/notify";
import { playBeep } from "@lib/utils/sound.utils";
import { useQueryClient } from "@tanstack/react-query";

export default function NewNotificationSockets() {
    const { socket, user } = useSocket();
    const queryClient = useQueryClient();
    const sendNotification = () => {
        if (!socket) return;

        const notificationData = {
            subject: "New Notification",
            message: `A new notification has been sent.`,
            type: "info",
            reference_id: 33,
            created_by: "62e044f9-97b9-42e0-b1f9-504f0530713f",
            // userIds: [
            //     "b284b85b-cda1-4f98-9804-08563b0a06c9",
            //     "207ac622-41c8-4f4d-948d-419bd6c0a795",
            // ],
        };
        socket.emit("send_notification", notificationData);

        // socket.emit("send_notification", {
        //     type: "info",
        //     title: "New Notification",
        //     message: "Notification Message!",
        //     sender: user?.name || "Admin",
        //     targetUserId: "b284b85b-cda1-4f98-9804-08563b0a06c9",
        // });
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
                            <h3 className="font-bold">{data?.subject}</h3>
                            <p>{data?.message}</p>
                        </div>
                    ),
                },
                data?.type || "info"
            );
            playBeep();
            queryClient.invalidateQueries({
                queryKey: ["user-notifications"],
            });
            queryClient.invalidateQueries({ queryKey: ["unread-count"] });
        });

        return () => {
            socket.off("new_notification");
        };
    }, [socket]);

    // return (
    //     <div>
    //         <button
    //             className="btn btn-xs btn-primary"
    //             onClick={sendNotification}
    //         >
    //             <Bell size={16} />
    //         </button>
    //     </div>
    // );
}
