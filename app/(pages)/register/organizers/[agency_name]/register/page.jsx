import React from 'react'

export default async function page({ params }) {
    const { agency_name } = await params;
    return (
        <div>
            New Donor Registration for {agency_name}
        </div>
    )
}
