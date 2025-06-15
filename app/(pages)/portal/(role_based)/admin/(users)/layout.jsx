import React from 'react'

export default function layout({ children }) {
    return (
        <div className='p-2 md:p-5'>
            {children}
        </div>
    )
}
