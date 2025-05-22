import { FileQuestion, UserPlus2, Users, Users2 } from "lucide-react";
import { BiError } from "react-icons/bi";
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
            title: "Users List",
            path: "/users",
            icon: <Users2 />,
            has_child: false,
        },
        {
            title: "New User",
            path: "/users/create",
            icon: <UserPlus2 />,
            has_child: false,
        },
        {
            title: "Error page",
            path: "/auth/error",
            icon: <BiError />,
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
    breadcrumbs: [],
    setBreadcrumbs: (newBreadcrumbs) => set({ breadcrumbs: newBreadcrumbs }),
    menus: [
        {
            title: "Dashboard",
            path: "/dashboard",
            icon: "dashboard-icon",
            roles: ["admin", "editor", "viewer"],
            has_child: false,
            children: [
                {
                    title: "Analytics",
                    path: "/dashboard/analytics",
                    icon: "analytics-icon",
                    roles: ["admin", "editor"]
                }
            ]
        }
    ]
}));
