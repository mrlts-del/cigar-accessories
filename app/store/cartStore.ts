import { create } from 'zustand'
import { Product } from '../data/products'

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalItems: 0,
  
  addItem: (product) => set((state) => {
    const existingItem = state.items.find(item => item.id === product.id);
    
    if (existingItem) {
      const updatedItems = state.items.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      return {
        items: updatedItems,
        totalItems: state.totalItems + 1
      };
    }
    
    return {
      items: [...state.items, { ...product, quantity: 1 }],
      totalItems: state.totalItems + 1
    };
  }),

  removeItem: (productId) => set((state) => {
    const item = state.items.find(item => item.id === productId);
    return {
      items: state.items.filter(item => item.id !== productId),
      totalItems: state.totalItems - (item?.quantity || 0)
    };
  }),

  updateQuantity: (productId, quantity) => set((state) => {
    const oldQuantity = state.items.find(item => item.id === productId)?.quantity || 0;
    const quantityDiff = quantity - oldQuantity;
    
    return {
      items: state.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ),
      totalItems: state.totalItems + quantityDiff
    };
  }),

  clearCart: () => set({ items: [], totalItems: 0 })
}));