import RegisterOptions from '@components/register/RegisterOptions'
import Image from 'next/image'
import React from 'react'

export default function page() {
  return (
    <div className="relative min-h-[calc(100vh-185px)] overflow-hidden">
        {/* <div className="absolute inset-0 z-0">
            <div className="bg-gradient-to-r from-red-900/65 dark:from-red-900/85 via-blue-800/65 dark:via-blue-800/75 to-yellow-900/60 dark:to-yellow-900/80 w-full h-full" />
        </div> */}
        <Image
            src="/change-role-bg.jpg"
            alt="Register Background"
            fill
            priority
            className="object-cover opacity-30 dark:opacity-20"
        />
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-10" />
        <div className="relative z-10">
            <RegisterOptions />
        </div>
    </div>
  )
}
