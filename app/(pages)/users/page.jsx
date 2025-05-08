import Link from "next/link";

export default function Page() {
    return (
        <div className="w-full h-full md:w-1/2 lg:w-3/4 mx-auto shadow-lg space-y-3">
            <p className="text-3xl font-bold text-shadow-lg italic">
                Users List
            </p>
            <Link href="/users/create" className="btn">
                Create
            </Link>
        </div>
    );
}
