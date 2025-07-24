"use client";
import { useState } from "react";
import { updateEventStatus } from "@/action/adminEventAction";
import { updateAgencyStatus } from "@/action/agencyAction";
import { bookDonorAppointment } from "@/action/donorAppointmentAction";

import { Form } from "@components/ui/form";
import { Checkbox } from "@components/ui/checkbox";
import notify from "@components/ui/notify";
import SweetAlert from "@components/ui/SweetAlert";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Book, CalendarPlus } from "lucide-react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { BookingSuccessAlert, showBookingSuccessAlert } from "../../lib/utils/showBookingSuccessAlert";

export default function BookEventButton({
    event,
    schedule,
    isDisabled = false,
    icon = <CalendarPlus />,
    label = "Book",
    className = "btn-neutral",
    formClassName = "",
    onLoad = () => { },
    onFinish = () => { },
}) {
    const queryClient = useQueryClient();

    const eventDetails = {
        id: schedule?.id,
        title: event?.title,
        date: moment(schedule?.date).format("MMM DD, YYYY"),
        time: `${moment(schedule?.time_start, "HH:mm:ss").format("hh:mm A")} - ${moment(schedule?.time_end, "HH:mm:ss").format("hh:mm A")}`,
        location: event?.agency?.agency_address || 'TBD',
    }

    const {
        // data: eventData,
        mutate,
        isPending,
    } = useMutation({
        mutationFn: async (formData) => {
            onLoad();
            const res = await bookDonorAppointment(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["blood_drives"] });
            showBookingSuccessAlert(eventDetails);
            // SweetAlert({
            //     title: "Blood Donation Booked",
            //     text: `You have successfully booked an appointment for ${event?.title
            //         } on ${moment(schedule?.date).format(
            //             "MMM DD, YYYY"
            //         )} from ${moment(schedule?.time_start, "HH:mm:ss").format(
            //             "hh:mm A"
            //         )} to ${moment(schedule?.time_end, "HH:mm:ss").format(
            //             "hh:mm A"
            //         )}.`,

            //     icon: "info",
            //     confirmButtonText: "Done",
            // });
        },
        onError: (error) => {
            notify({ error: true, message: error?.message }, "warning", "top-center");
            onFinish();
        },
        onSettled: () => {
            onFinish();
        },
    });

    const form = useForm({
        mode: "onChange",
        defaultValues: {
            time_schedule_id: schedule?.id,
            event_id: schedule?.blood_donation_event_id,
        },
    });

    const { handleSubmit, reset } = form;

    const onSubmit = async (data) => {

        MySwal.fire({
            title: "Book Blood Donation Appointment",
            html: `
                <div class="space-y-4">
                    <p class="text-left mb-4">Please review the appointment details:</p>
                    <div class="text-left bg-gray-50 p-4 rounded-lg">
                        <p><strong>Event:</strong> ${eventDetails?.title}</p>
                        <p><strong>Date:</strong> ${eventDetails?.date}</p>
                        <p><strong>Time:</strong> ${eventDetails?.time}</p>
                        <p><strong>Location:</strong> ${eventDetails?.location}</p>
                    </div>
                    <div class="mt-4">
                        <label class="flex items-center">
                            <input type="checkbox" id="terms-checkbox" class="form-checkbox" />
                            <span class="ml-2 text-sm">I agree to the <a class="text-blue-500" href="/legal" target="_blank">Terms and conditions</a> for blood donation</span>
                        </label>
                    </div>
                </div>
            `,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Confirm Booking",
            confirmButtonColor: "#059669",
            cancelButtonText: "Cancel",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                const checkbox = document.getElementById('terms-checkbox');
                if (!checkbox.checked) {
                    Swal.showValidationMessage('You must agree to the terms and conditions');
                    return false; // This will prevent the modal from closing
                }
                // Return the data you want to pass to .then()
                return {
                    agreed: true,
                };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value.agreed) {

                mutate(data);
            }
        });

    };

    return (
        <Form {...form}>
            <form
                className={`${formClassName}`}
                onSubmit={handleSubmit(onSubmit)}
            >
                <button
                    type="submit"
                    disabled={isPending || isDisabled}
                    className={clsx(
                        "btn btn-neutral hover:bg-neutral-800 hover:text-green-300",
                        className
                    )}
                >
                    {isPending ? (
                        <>
                            <span className="loading loading-bars loading-xs"></span>
                            Submitting ...
                        </>
                    ) : (
                        <>
                            {icon}
                            <span className="hidden md:inline-block">{label}</span>
                        </>
                    )}
                </button>
            </form>
        </Form>
    );
}
