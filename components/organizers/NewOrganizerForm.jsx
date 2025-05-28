"use client";
import NewAgencyStepForm from "@/(pages)/portal/(role_based)/admin/(agencies)/agencies/create/NewAgencyStepForm";
import React, { useState } from "react";

export default function NewOrganizerForm({ admin }) {
    if (!admin) {
        throw "You are not allowed to access this page.";
    }
    return (
        <div>
            <h1 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                <span className="min-w-96 block">Agency Administrator:</span>
                <div className="flex-1 space-x-3">
                    <span className="badge badge-primary text-white font-bold px-3 py-2">
                        {admin.name}
                    </span>
                    <span className="text-sm italic link text-muted-foreground">
                        ({admin.email.toLowerCase()})
                    </span>
                </div>
            </h1>
            <NewAgencyStepForm />
        </div>
    );
}
