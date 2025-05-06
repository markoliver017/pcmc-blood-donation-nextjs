import { FileQuestion, Users } from "lucide-react";
import { create } from "zustand";

export const usePagesStore = create((set) => ({
    pages: [
        {
            title: "Dashboard",
            path: "/admin",
            icon: "📊",
            has_child: false,
        },
        {
            title: "Profile",
            path: "/admin/profile",
            icon: "👤",
            has_child: false,
        },
        {
            title: "Form Responses",
            path: "/admin/reports",
            icon: "📄",
            has_child: false,
        },
        {
            title: "Data Requests",
            path: "/admin/requests",
            icon: <FileQuestion />,
            has_child: false,
        },
        {
            title: "System Administation",
            path: "#",
            icon: "⚙️",
            has_child: true,
            child: [
                {
                    title: "Users Management",
                    path: "/admin/users",
                    icon: <Users />,
                },
                // {
                //     title: "Medication Errors",
                //     path: "/admin/error_types",
                //     icon: <MdMedication />,
                // },
            ],
        },
    ],
    setPages: (newPages) => set({ pages: newPages }), // Optional if you need to modify `pages`
}));
