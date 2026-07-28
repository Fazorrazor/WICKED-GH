import { create } from "zustand";

export type CartItem = {
  id: string;
  productId: string;
  title: string;
  price_cents: number;
  variationName: string;
  image: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "id" | "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isOpen: false,

  addItem: (item) =>
    set((state) => {
      // Check if item with same product and variation already exists
      const existingItemIndex = state.items.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.variationName === item.variationName,
      );

      if (existingItemIndex > -1) {
        // Increment quantity
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += 1;
        return { items: newItems, isOpen: true };
      }

      // Add new item
      const newItem = {
        ...item,
        id: `${item.productId}-${item.variationName}-${Date.now()}`,
        quantity: 1,
      };

      return { items: [...state.items, newItem], isOpen: true };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  clearCart: () => set({ items: [] }),
}));
