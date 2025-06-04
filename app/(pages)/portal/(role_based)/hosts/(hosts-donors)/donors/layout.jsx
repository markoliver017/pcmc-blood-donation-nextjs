import AdminDonorClient from "@components/donors/AdminDonorClient";

export default async function AdminDonorClientLayout({ children, approval }) {
    return <AdminDonorClient approval={approval}>{children}</AdminDonorClient>;
}
