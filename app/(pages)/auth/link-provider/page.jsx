// app/auth/link-provider/page.js
'use client';

import { useSession, signIn } from 'next-auth/react';

export default function LinkProvider() {
    const { data: session } = useSession();

    if (!session) {
        return <p>Please sign in to link a provider.</p>;
    }

    return (
        <div>
            <h1>Link OAuth Providers</h1>
            <p>Signed in as {session.user.email}</p>
            <button onClick={() => signIn('github')}>Link GitHub</button>
            <button onClick={() => signIn('google')}>Link Google</button>
        </div>
    );
}