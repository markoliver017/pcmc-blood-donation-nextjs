import { useToastStore } from "@/store/toastStore";
import { useEffect } from "react";

export function useModalToastContainer(containerId = "modal-toast") {
    const setContainerId = useToastStore((state) => state.setContainerId);

    useEffect(() => {
        setContainerId(containerId);
        return () => setContainerId("main");
    }, [containerId, setContainerId]);
}
