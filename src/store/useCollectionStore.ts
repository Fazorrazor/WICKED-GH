import { create } from "zustand";

interface CollectionState {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  productCount: number;
  setProductCount: (count: number) => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  activeCategory: null,
  setActiveCategory: (category) => set({ activeCategory: category }),
  productCount: 0,
  setProductCount: (count) => set({ productCount: count }),
}));
