import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import BloodCollecitionList from "./BloodCollecitionList";
import { MdBloodtype } from "react-icons/md";

export default function Page() {
    return (
        <>
            <WrapperHeadMain
                icon={<MdBloodtype />}
                pageTitle="Blood Collections"
                breadcrumbs={[
                    {
                        path: "/portal/admin/blood-collections",
                        icon: <MdBloodtype className="w-4" />,
                        title: "Blood Collections",
                    },
                ]}
            />
            <div className="w-full h-full 2xl:px-5 mx-auto shadow-lg mt-5  space-y-3">
                <BloodCollecitionList />
            </div>
        </>
    );
}
