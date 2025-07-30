import { Button } from "@components/ui/button";
import { CheckIcon, Eye } from "lucide-react";

import { useRouter } from "next/navigation";
import VerifyDonor from "./VerifyDonor";
import RejectDonor from "./RejectDonor";

export default function ApprovalRejectComponent({ data, callbackUrl }) {
    const router = useRouter();
    return (
        <div className="px-2 space-y-1 my-2">
            <Button
                onClick={() => router.push(callbackUrl)}
                variant="secondary"
                className=" hover:bg-orange-300 active:ring-2 active:ring-orange-800 dark:active:ring-orange-200 btn-block"
            >
                <Eye />
                Details
            </Button>
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
            <RejectDonor donorId={data.id} className="w-full btn-error" />
        </div>
    );
}
