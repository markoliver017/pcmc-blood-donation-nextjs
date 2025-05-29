import React from 'react'

export default function DisplayValidationErrors({ errors }) {

    if (errors && typeof errors === 'object' && Object.entries(errors).length > 0) {
        return (
            <div className='alert alert-error'>
                <ul className="list-disc ml-5 text-sm">
                    <h3 className="font-bold block">Check your inputs</h3>
                    {Object.entries(errors).map(([key, value]) => (
                        <li className="cursor-pointer" key={key} title={`${key.replace("_", " ")} field`}>
                            {value.message}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}
