"use client";
import React from "react";

export default function FormLogger({
    watch = null, //RHF
    errors = null, //RHF
    data = null, //useMutation
    initialData = null, //useMutation
}) {
    return (
        <div className="card-body border my-5 dark:bg-gray-800 dark:text-white">
            {watch && (
                <>
                    <div className="font-bold">Watch FormData:</div>
                    <pre>{JSON.stringify(watch(), null, 3)}</pre>
                </>
            )}
            {errors && (
                <>
                    <div className="font-bold text-red-500">Form Errors: </div>
                    <pre>{JSON.stringify(errors, null, 3)}</pre>
                </>
            )}
            {initialData && (
                <>
                    <div className="font-bold">Initial data</div>
                    <pre>{JSON.stringify(initialData, null, 3)}</pre>
                </>
            )}
            {data && (
                <>
                    <div className="font-bold text-green-500">
                        Mutate Success data
                    </div>
                    <pre>{JSON.stringify(data, null, 3)}</pre>
                </>
            )}
        </div>
    );
}
