import { auth } from "@lib/auth";
import { Agency, AgencyCoordinator, Donor } from "@lib/models";
import { redirect } from "next/navigation";
import React from "react";
import ErrorPage from "./ErrorPage";
import ErrorModal from "@components/layout/ErrorModal";

export default async function PortalLayout({ children }) {
    const session = await auth();

    if (!session || !session?.user?.roles?.length) redirect("/");

    const { roles, role_name: session_role } = session.user;

    let currentLoggedInRole = roles.find(
        (role) => role.role_name == session_role
    );

    if (currentLoggedInRole) {
        if (session_role == "Agency Administrator") {
            const agency = await Agency.findOne({
                where: { head_id: session.user.id },
                attributes: {
                    exclude: [
                        "createdAt",
                        "updatedAt",
                        "verified_by",
                        "updated_by",
                    ],
                },
            });
            if (!agency) {
                return (
                    <ErrorModal>
                        <ErrorPage className="bg-amber-500">
                            Hi, {session.user.name}, <br />
                            Your current role is {session_role}, but you are not
                            linked to any partner agency.
                            <br />
                            <br />
                        </ErrorPage>
                    </ErrorModal>
                );
            }

            if (agency?.status == "for approval") {
                return (
                    <ErrorModal>
                        <ErrorPage className="bg-amber-500">
                            Hi, Mr/Ms <b>{session.user.name}</b>, <br />
                            We appreciate your interest in accessing this page.
                            However, your request is currently pending approval.
                            You will receive a notification once a decision has
                            been made.
                            <br />
                        </ErrorPage>
                    </ErrorModal>
                );
            }
            if (agency?.status == "rejected") {
                return (
                    <ErrorModal>
                        <ErrorPage className="bg-amber-500">
                            Unfortunately, your request to access this page has
                            been rejected. The reason for rejection is:{" "}
                            {agency?.remarks}
                            . If you have any questions or would like further
                            clarification, please don't hesitate to reach out to
                            us.
                            <br />
                        </ErrorPage>
                    </ErrorModal>
                );
            }
            if (agency?.status == "deactivated") {
                return (
                    <ErrorModal>
                        <ErrorPage className="bg-amber-500">
                            Your access to this page has been deactivated. If
                            you believe this is an error or would like to
                            request reactivation, please contact us for
                            assistance.
                            <br />
                        </ErrorPage>
                    </ErrorModal>
                );
            }
        }

        if (session_role == "Organizer") {
            const agency = await AgencyCoordinator.findOne({
                where: { user_id: session.user.id },
            });

            if (!agency) {
                return (
                    <ErrorModal>
                        <ErrorPage className="bg-amber-500">
                            Hi, {session.user.name}, <br />
                            Your current role is {session_role}, but you are not
                            linked to any partner agency.
                            <br />
                            <br />
                        </ErrorPage>
                    </ErrorModal>
                );
            }

            if (agency?.status == "for approval") {
                return (
                    <ErrorModal>
                        <ErrorPage className="bg-amber-500">
                            Hi, Mr/Ms <b>{session.user.name}</b>, <br />
                            We appreciate your interest in accessing this page.
                            However, your request is currently pending approval.
                            You will receive a notification once a decision has
                            been made.
                            <br />
                        </ErrorPage>
                    </ErrorModal>
                );
            }
            if (agency?.status == "rejected") {
                return (
                    <ErrorModal>
                        <ErrorPage className="bg-amber-500">
                            Unfortunately, your request to access this page has
                            been rejected. The reason for rejection is:{" "}
                            {agency?.remarks}
                            . If you have any questions or would like further
                            clarification, please don't hesitate to reach out to
                            us.
                            <br />
                        </ErrorPage>
                    </ErrorModal>
                );
            }
            if (agency?.status == "deactivated") {
                return (
                    <ErrorModal>
                        <ErrorPage className="bg-amber-500">
                            Your access to this page has been deactivated. If
                            you believe this is an error or would like to
                            request reactivation, please contact us for
                            assistance.
                            <br />
                        </ErrorPage>
                    </ErrorModal>
                );
            }
        }

        if (session_role == "Donor") {
            const donor = await Donor.findOne({
                where: { user_id: session.user.id },
                attributes: ["id"],
            });
            if (!donor) {
                redirect("/organizers");
            }
        }
    }

    return (
        <div>
            {children}
            {/* <pre>
                User: {JSON.stringify(session.user, null, 2)}
                <br />
                <br />
                Current Logged in Role:{" "}
                {JSON.stringify(currentLoggedInRole, null, 2)}
                <br />
                <br />
                Session Role = {session_role}
                <br />
                <br />
                Agency Headed = {JSON.stringify(agency, null, 2)}
            </pre> */}
        </div>
    );
}
