import React, { use } from "react";

export default function UsersList({ fetchUsers }) {
    const users = use(fetchUsers);
    return <div>UsersList</div>;
}
