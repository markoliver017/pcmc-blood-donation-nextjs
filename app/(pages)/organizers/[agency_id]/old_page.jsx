import { Suspense } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { getOrganizerRole } from "@/action/registerAction";
import Skeleton from "@components/ui/skeleton";
import NewUserForm from "../../../../components/user/NewUserBasicInfoForm";
import { auth } from "@lib/auth";
import NewOrganizerForm from "../../../../components/organizers/NewOrganizerForm";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { fetchluzonDemographics } from "@/action/locationAction";
import { Agency, User } from "@lib/models";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import Image from "next/image";

export default async function Page() {
    const session = await auth();
    console.log("session in register", session);

    if (session && session?.user) {
        // const agency_head = await User.findByPk("14abe03d-b9f8-4076-a36f-9d595fd84138", {
        const agency_head = await User.findByPk(session.user.id, {
            attributes: [
                "id",
                "name",
                "full_name",
                "first_name",
                "last_name",
                "email",
                "image",
            ],
            include: [
                {
                    model: Agency,
                    attributes: ["id", "name"],
                    as: "headedAgency",
                    required: true,
                },
            ],
        });

        if (agency_head) {
            return (
                <Card className="mx-auto max-w-max">
                    <CardHeader>
                        <CardTitle>
                            Welcome,{" "}
                            <span className="font-bold">
                                {agency_head?.full_name || agency_head?.name}
                            </span>
                            !
                        </CardTitle>
                        <CardDescription>
                            Your account is currently linked to the partner
                            agency{" "}
                            <span className="italic font-semibold">
                                {agency_head.headedAgency.name}
                            </span>
                            .
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link
                            href="/portal"
                            className="flex items-center gap-4 mt-2 cursor-pointer rounded ring-blue-400 p-5 hover:ring active:ring-2"
                        >
                            <div className="flex-none h-32 w-32 relative rounded-4xl mx-auto shadow-xl overflow-hidden">
                                <Image
                                    src={
                                        agency_head.image ||
                                        "/default_avatar.png"
                                    }
                                    alt="Avatar"
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold">
                                    Dashboard
                                </h2>
                                <p className="text-sm font-medium text-blue-500 link">
                                    {agency_head.email.toLowerCase()}
                                </p>
                                <p className="text-sm text-muted-foreground ">
                                    Agency Administrator
                                </p>
                            </div>
                        </Link>
                    </CardContent>
                </Card>
            );
        }
    }

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["luzonDemographics"],
        queryFn: fetchluzonDemographics,
    });

    return (
        <Suspense fallback={<Skeleton />}>
            <div className="w-full h-full md:w-8/10 2xl:w-3/4 mx-auto relative">
                {!session || !session?.user ? (
                    <>
                        <Link href="/" className="mb-3 absolute top-5 right-4">
                            <button
                                className="btn btn-circle btn-warning w-max p-3"
                                tabIndex={-1}
                            >
                                <span className="hidden sm:inline-block">
                                    Cancel
                                </span>{" "}
                                <X />
                            </button>
                        </Link>
                        <NewUserForm role={getOrganizerRole()} />
                    </>
                ) : (
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <NewOrganizerForm admin={session.user} />
                    </HydrationBoundary>
                )}
            </div>
        </Suspense>
    );
}
