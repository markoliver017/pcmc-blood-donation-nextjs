"use client";
import NewAgencyStepForm from "@/(pages)/portal/(role_based)/admin/(agencies)/agencies/create/NewAgencyStepForm";
import React from "react";

export default function NewDonorForm({ donor }) {
    if (!donor) {
        throw "You are not allowed to access this page.";
    }

    return (
        <div>
            <h1 className="text-2xl mb-5">
                Donor Account:{" "}
                <span className="font-semibold">{donor.name}</span>{" "}
                <i>({donor.email})</i>
            </h1>
            {/* <NewAgencyStepForm /> */}
        </div>
    );
}
