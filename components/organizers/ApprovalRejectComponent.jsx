import { CheckIcon, Eye } from "lucide-react";
import VerifyAgency from "@components/organizers/VerifyAgency";
import RejectDialog from "@components/organizers/RejectDialog";

import Link from "next/link";

export default function ApprovalRejectComponent({ agency, target = "" }) {
    return (
        <div className="px-2 space-y-1 my-2">
            <Link
                href={`/portal/admin/agencies/${agency.id}`}
                variant="secondary"
                className="btn hover:bg-orange-300 active:ring-2 active:ring-orange-800 dark:active:ring-orange-200 btn-block"
                target={target}
            >
                <Eye />
                Details
            </Link>

            <VerifyAgency
                agencyData={{
                    id: agency.id,
                    status: "activated",
                }}
                label="Approve"
                className="btn btn-block btn-success"
                formClassName="w-full"
                icon={<CheckIcon />}
            />

            <RejectDialog agencyId={agency.id} className="w-full btn-error" />
        </div>
    );
}
