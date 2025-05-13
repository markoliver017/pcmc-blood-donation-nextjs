"use client"
import { fetchluzonDemographics } from '@/action/agencyAction';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export default function AgencyList() {
    const queryClient = useQueryClient();
    const demographicsQuery = useQuery({
        queryKey: ["luzonDemographics"],
        queryFn: fetchluzonDemographics,
    });

    return (
        <div>
            <Link href="/agencies/create" className='btn btn-neutral'><Plus />Create</Link>
            <h1>Agency List</h1>
        </div>
    )
}
