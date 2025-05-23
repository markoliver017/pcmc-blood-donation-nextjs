"use client";
import React from "react";

export default function FormLogger({
    watch = null, //RHF
    errors = null, //RHF
    data = null, //useMutation
}) {
    return (
        <div className="card-body border my-5">
            {watch && (
                <>
                    <div className="font-bold">Watch FormData:</div>
                    <pre>{JSON.stringify(watch(), null, 3)}</pre>
                </>
            )}

            {errors && (
                <>
                    <div>Form Errors: </div>
                    <pre>{JSON.stringify(errors, null, 3)}</pre>
                </>
            )}

            {data && (
                <>
                    <div>Mutate Success data</div>
                    <pre>{JSON.stringify(data, null, 3)}</pre>
                </>
            )}
        </div>
    );
}
