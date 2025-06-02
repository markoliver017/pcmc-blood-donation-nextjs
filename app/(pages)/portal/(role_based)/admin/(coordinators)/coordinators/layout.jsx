import CoorClientLayout from "./CoorClientLayout";

export default async function AgenciesLayout({ children, approval }) {
    return <CoorClientLayout approval={approval}>{children}</CoorClientLayout>;
}
