"use client";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { CalendarCheck, CalendarPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AdminEventClient({ children, approval }) {
    const pathname = usePathname();
    const session = useSession();
    console.log(session)

    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "all";

    const handleTabChange = (value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    if (pathname == "/portal/admin/events") {
        return (
            <>
                <WrapperHeadMain
                    icon={<CalendarCheck />}
                    pageTitle="Blood Drives"
                    breadcrumbs={[
                        {
                            path: "/portal/admin/events",
                            icon: <CalendarCheck className="w-4" />,
                            title: "Blood Drives",
                        },
                    ]}
                />
                {session?.data?.user?.role_name == "Agency Administrator" || session?.data?.user?.role_name == "Organizer" && (

                    <div className="p-5">
                        <Link
                            href="/portal/admin/events/create"
                            className="btn btn-neutral mb-4"
                        >
                            <CalendarPlus /> Add New Event{" "}
                        </Link>
                    </div>
                )}
                <Tabs
                    defaultValue={currentTab}
                    onValueChange={handleTabChange}
                    className="px-1 md:px-5"
                >
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="for-approval">
                            For Approval
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">{children}</TabsContent>
                    <TabsContent value="for-approval">{approval}</TabsContent>
                </Tabs>
            </>
        );
    }
    return <>{children}</>;
}
