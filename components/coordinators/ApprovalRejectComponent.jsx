"use client";
import { Button } from "@components/ui/button";
import { CheckIcon, Eye } from "lucide-react";

import { useRouter } from "next/navigation";
import VerifyCoordinator from "./VerifyCoordinator";
import RejectCoordinator from "./RejectCoordinator";

export default function ApprovalRejectComponent({
    coordinator,
    callbackUrl = "/portal/admin/coordinators",
}) {
    const router = useRouter();
    return (
        <div className="px-2 space-y-1 my-2">
            <Button
                onClick={() => router.push(`${callbackUrl}/${coordinator.id}`)}
                variant="secondary"
                className=" hover:bg-orange-300 active:ring-2 active:ring-orange-800 dark:active:ring-orange-200 btn-block"
            >
                <Eye />
                Details
            </Button>

            <VerifyCoordinator
                agencyData={{
                    id: coordinator.id,
                    status: "activated",
                }}
                label="Approve"
                className="btn btn-block btn-success"
                formClassName="w-full"
                icon={<CheckIcon />}
            />

            <div className="flex justify-between">
                <RejectCoordinator
                    coordinatorId={coordinator.id}
                    className="w-full btn-error"
                />
            </div>
        </div>
    );
}
