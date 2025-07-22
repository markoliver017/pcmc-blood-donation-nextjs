import CoorClientLayout from "@components/coordinators/CoorClientLayout";

export default async function AgenciesLayout({ children, approval }) {
    return <CoorClientLayout approval={approval}>{children}</CoorClientLayout>;
}
