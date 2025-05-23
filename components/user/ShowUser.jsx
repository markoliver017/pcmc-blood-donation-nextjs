"use client";
import { getUser } from "@/action/userAction";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import { Button } from "@components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table";
import { formatFormalName } from "@lib/utils/string.utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import UserLoading from "../../app/(pages)/portal/(role_based)/admin/(users)/users/UserLoading";

export default function ShowUser({ userId }) {
    const router = useRouter();
    const {
        data: user,
        isFetching,
        isLoading,
    } = useQuery({
        queryKey: ["user", userId],
        queryFn: async () => {
            const res = await getUser(userId);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
        enabled: !!userId,
    });

    if (isLoading || isFetching) return <UserLoading />;

    return (
        <Card className="p-5 h-full">
            <CardHeader>
                <CardTitle className="flex justify-between">
                    <span className="text-4xl">
                        {user.name || user.full_name}
                    </span>
                    <div>
                        <Button
                            onClick={() =>
                                router.push(
                                    `/portal/admin/users/${user.id}/edit`
                                )
                            }
                            variant="secondary"
                            className=" hover:bg-orange-300 active:ring-2 active:ring-orange-800 dark:active:ring-orange-200"
                        >
                            <Pencil />
                        </Button>
                    </div>
                </CardTitle>
                <CardDescription>User Information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap xl:flex-nowrap gap-2">
                <CustomAvatar
                    avatar={user.image || "/default_avatar.png"}
                    className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] xl:w-[350px] xl:h-[350px] flex-none"
                />
                <Table className="min-w-sm table-zebra ">
                    {/* <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader> */}
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-semibold">ID</TableCell>
                            <TableCell>{user.id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Roles
                            </TableCell>
                            <TableCell className="flex flex-col gap-2">
                                {user.roles?.map((role) => (
                                    <span key={role.id}>
                                        {formatFormalName(role.role_name)}
                                    </span>
                                ))}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                First Name
                            </TableCell>
                            <TableCell>{user.first_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Middle Name
                            </TableCell>
                            <TableCell>{user.middle_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Last Name
                            </TableCell>
                            <TableCell>{user.last_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Email
                            </TableCell>
                            <TableCell>
                                <a
                                    className="link link-primary italic"
                                    href={`mailto:${user.email}`}
                                >
                                    {formatFormalName(user.email)}
                                </a>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Gender
                            </TableCell>
                            <TableCell>
                                {formatFormalName(user.gender)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Status
                            </TableCell>
                            {user.status ? (
                                <TableCell>
                                    <div className="badge p-2 font-semibold text-xs badge-success">
                                        Activated
                                    </div>
                                </TableCell>
                            ) : (
                                <TableCell>
                                    <div className="badge p-2 font-semibold text-xs badge-error">
                                        Deactivated
                                    </div>
                                </TableCell>
                            )}
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
