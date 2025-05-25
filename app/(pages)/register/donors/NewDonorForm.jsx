"use client";
import NewAgencyStepForm from "@/(pages)/portal/(role_based)/admin/(agencies)/agencies/create/NewAgencyStepForm";
import React, { useState } from "react";

export default function NewDonorForm({ admin }) {
    if (!admin) {
        throw "You are not allowed to access this page.";
    }

    return (
        <div>
            <h1 className="text-2xl mb-5">
                Agency Administrator:{" "}
                <span className="font-semibold">{admin.name}</span>{" "}
                <i>({admin.email})</i>
            </h1>
            <NewAgencyStepForm />
        </div>
    );
}
