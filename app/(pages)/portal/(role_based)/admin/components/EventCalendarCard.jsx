"use client";

import { memo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

const AllEventCalendar = dynamic(() => import('@components/organizers/AllEventCalendar'), {
    loading: () => <div className="skeleton h-96 w-full"></div>,
    ssr: false
});

function EventCalendarCard() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl">
                    Event Calendar
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AllEventCalendar />
            </CardContent>
        </Card>
    );
}

export default memo(EventCalendarCard);
