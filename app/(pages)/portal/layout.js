import { auth } from '@lib/auth';
import { redirect } from 'next/navigation';
import React from 'react'
import ClientPortal from './ClientPortal';

export default async function PortalLayout({ children }) {
    const session = await auth();

    if (!session || !session?.user?.roles?.length) redirect("/");

    return (
        <>
            <ClientPortal />
            {children}
        </>
    )
}
