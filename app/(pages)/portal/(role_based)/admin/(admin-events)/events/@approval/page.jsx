import ForApprovalEventList from "./ForApprovalEventList";

export default function Page() {
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 p-3 w-full">
                <ForApprovalEventList />
            </div>
        </>
    );
}
