import { create } from 'zustand';

interface AppState {
    renderTriggerKey: number;
    triggerRender: (key: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
    renderTriggerKey: 0,
    triggerRender: (key) => set({ renderTriggerKey: key }),
}));
