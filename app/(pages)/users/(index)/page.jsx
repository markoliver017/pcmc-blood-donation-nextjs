import UsersList from "./UsersList";

export default async function Page() {
    return (
        <div className="w-full h-full 2xl:px-5 mx-auto shadow-lg space-y-3">
            <UsersList />
        </div>
    );
}
