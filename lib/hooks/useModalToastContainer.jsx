import { useToastStore } from "@/store/toastStore";
import { useEffect } from "react";

export function useModalToastContainer() {
    const setContainerId = useToastStore((state) => state.setContainerId);

    useEffect(() => {
        setContainerId("modal-toast");
        return () => setContainerId("main");
    }, [setContainerId]);
}
