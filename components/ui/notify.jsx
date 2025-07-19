"use client";
import { toast, Bounce } from "react-toastify";
import parse from "html-react-parser"; // Import html-react-parser
import { useToastStore } from "@/store/toastStore";

export default function notify(res, type = null, position = "bottom-right") {

    const { error, message } = res;
    // const containerId = res?.containerId || "main";
    const containerId = useToastStore.getState().containerId;

    // If the message is a string, parse it. Otherwise, render it as a component.
    const content = typeof message === "string" ? parse(message) : message;

    if (!type) {

        if (error) {
            toast.error(content, {
                position,
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
                containerId
            });
        } else {
            toast.success(content);
        }

    } else {
        toast[type](content, {
            position,
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            containerId
        });
    }
}
