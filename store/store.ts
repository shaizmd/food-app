import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface cartItem {
     id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
    quantity: number; // Added quantity to track the number of items in the cart
}

export interface StoreState {
    cart: cartItem[];
    addToCart: (item: Omit<cartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    incrementQuantity: (id: string) => void;
    decrementQuantity: (id: string) => void;
    clearCart: () => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set) => ({
            cart: [],
            addToCart: (item) => set((state) => {
                const cartItemExists = state.cart.find(cartItem => cartItem.id === item.id);
                if (cartItemExists) {
                    // If item exists, increment its quantity
                    return {
                        cart: state.cart.map(cartItem =>
                            cartItem.id === item.id 
                                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                : cartItem
                        )
                    };
                } else {
                    // If item doesn't exist, add it with quantity 1
                    return {
                        cart: [...state.cart, { ...item, quantity: 1 }]
                    };
                }
            }),
            removeFromCart: (id) => set((state) => ({
                cart: state.cart.filter(item => item.id !== id)
            })),
            incrementQuantity: (id) => set((state) => ({
                cart: state.cart.map(item =>
                    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                )
            })),
            decrementQuantity: (id) => set((state) => ({
                cart: state.cart.map(item =>
                    item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
                )
            })),
            clearCart: () => set({ cart: [] })
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage)
        }
    )
);