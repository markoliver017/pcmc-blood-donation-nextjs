
import AgencyListCard from '@components/organizers/AgencyListCard';

import React from 'react'

export default function OrganizerPage() {


    return (
        <div className='flex flex-col items-center w-full p-5'>
            <div className="w-full lg:9/10 xl:w-3/4">

                <AgencyListCard />
            </div>
            {/* <pre>
                {JSON.stringify(agencies, null, 2)}
            </pre> */}
        </div>
    )
}
