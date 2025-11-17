import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';

export interface ILayoutStore {
  fullSidebar: boolean;
  toggleSidebar: () => void;
}

const useBaseLayoutStore = create<ILayoutStore>((set) => ({
  fullSidebar: false,
  toggleSidebar: () => set((prev) => ({ fullSidebar: !prev.fullSidebar })),
}));

export const useLayoutStore = createSelectorFunctions(useBaseLayoutStore);
