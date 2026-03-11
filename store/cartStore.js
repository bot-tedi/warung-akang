import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { checkProductAvailability } from '@/lib/supabase';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      // Toggle cart sidebar
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      // Add item to cart with stock validation
      addItem: async (product) => {
        try {
          // Check stock availability
          const availability = await checkProductAvailability(product.id, 1);

          if (!availability.available) {
            throw new Error(`Insufficient stock for ${availability.productName}. Available: ${availability.currentStock}`);
          }

          set((state) => {
            const existingItem = state.items.find((item) => item.id === product.id);
            const requestedQuantity = existingItem ? existingItem.quantity + 1 : 1;

            // Check if we have enough stock for the requested quantity
            if (availability.currentStock < requestedQuantity) {
              throw new Error(`Cannot add more ${availability.productName}. Available: ${availability.currentStock}`);
            }

            if (existingItem) {
              return {
                items: state.items.map((item) =>
                  item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
              };
            }

            return {
              items: [...state.items, { ...product, quantity: 1 }],
            };
          });
        } catch (error) {
          console.error('Error adding item to cart:', error);
          throw error;
        }
      },

      // Remove item from cart
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      // Update item quantity with stock validation
      updateQuantity: async (productId, quantity) => {
        try {
          if (quantity > 0) {
            // Check stock availability
            const availability = await checkProductAvailability(productId, quantity);

            if (!availability.available) {
              throw new Error(`Insufficient stock for ${availability.productName}. Available: ${availability.currentStock}`);
            }
          }

          set((state) => {
            if (quantity <= 0) {
              return {
                items: state.items.filter((item) => item.id !== productId),
              };
            }

            return {
              items: state.items.map((item) =>
                item.id === productId ? { ...item, quantity } : item
              ),
            };
          });
        } catch (error) {
          console.error('Error updating quantity:', error);
          throw error;
        }
      },

      // Clear cart
      clearCart: () => set({ items: [] }),

      // Get total items count
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Get total price
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'warung-akang-cart',
    }
  )
);
