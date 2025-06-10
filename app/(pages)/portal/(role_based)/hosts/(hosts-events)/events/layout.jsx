import HostEventClient from "./HostEventClient";

export default async function HostEventLayout({ children, approval }) {
    return <HostEventClient approval={approval}>{children}</HostEventClient>;
}
