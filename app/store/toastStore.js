import { create } from 'zustand';

export const useToastStore = create((set) => ({
    containerId: "main",
    setContainerId: (id) => set({ containerId: id }),
}));