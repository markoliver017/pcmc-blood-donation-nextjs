import AdminEventClient from "./AdminEventClient";

export default async function HostEventLayout({ children, approval }) {
    return <AdminEventClient approval={approval}>{children}</AdminEventClient>;
}
