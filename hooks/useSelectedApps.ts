// store/useSelectedApps.ts
import { create } from "zustand";

type SelectedAppsStore = {
  selectedApps: string[];
  screen: boolean;
  setSelectedApps: (apps: string[]) => void;
  setScreen: (val: boolean) => void;
};

const useSelectedApps = create<SelectedAppsStore>((set) => ({
  selectedApps: [],
  screen: false,
  setSelectedApps: (apps) => set({ selectedApps: apps }),
  setScreen: (val) => set({ screen: val }),
}));

export default useSelectedApps;
