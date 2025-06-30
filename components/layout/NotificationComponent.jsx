import { Bell } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@components/ui/popover";

export default function NotificationComponent() {
    const unreadNotifications = 2;
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="relative rounded-full p-2 group transition-all duration-700 hover:cursor-pointer">
                    <Bell className="h-6 w-6 text-yellow-800 group-hover:scale-125 group-hover:text-yellow-600 transition-transform duration-700" />

                    {/* Badge for unread notifications */}
                    {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadNotifications > 99
                                ? "99+"
                                : unreadNotifications}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <div className="p-4 border-b font-semibold">Notifications</div>
                <div className="max-h-64 overflow-y-auto">
                    {/* Example list item */}
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <p className="text-sm font-medium">
                            New comment on your post
                        </p>
                        <p className="text-xs text-gray-500">5 minutes ago</p>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <p className="text-sm font-medium">
                            User Mark replied to your message
                        </p>
                        <p className="text-xs text-gray-500">12 minutes ago</p>
                    </div>
                    {/* More notifications... */}
                </div>
            </PopoverContent>
        </Popover>
    );
}
