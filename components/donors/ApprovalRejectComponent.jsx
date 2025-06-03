import { formatFormalName } from "@lib/utils/string.utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import { CheckIcon, Command, Eye, SquareMenu } from "lucide-react";

import { useRouter } from "next/navigation";
import VerifyDonor from "./VerifyDonor";
import RejectDonor from "./RejectDonor";

export default function ApprovalRejectComponent({ data, callbackUrl }) {
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="default" className="h-8 w-min p-0">
                    <span className="sr-only">Open menu</span>
                    {formatFormalName(data.status)}
                    <SquareMenu className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="flex items-center space-x-2">
                    <Command className="w-3 h-3" />
                    <span>Actions</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="space-x-2">
                    <Button
                        onClick={() => router.push(callbackUrl)}
                        variant="secondary"
                        className=" hover:bg-orange-300 active:ring-2 active:ring-orange-800 dark:active:ring-orange-200 btn-block"
                    >
                        <Eye />
                        Details
                    </Button>
                </DropdownMenuItem>

                <DropdownMenuItem className="space-x-2 flex justify-between">
                    <VerifyDonor
                        donorData={{
                            id: data.id,
                            status: "activated",
                        }}
                        label="Approve"
                        className="btn btn-block btn-success"
                        formClassName="w-full"
                        icon={<CheckIcon />}
                    />
                </DropdownMenuItem>
                <div className="px-2 flex justify-between">
                    <RejectDonor
                        donorId={data.id}
                        className="w-full btn-error"
                    />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
