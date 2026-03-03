"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  id: string;
  bookId: string;
  book: {
    id: string;
    name: string;
    price: number;
    coverImage: string | null;
  };
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  setItems: (items: WishlistItem[]) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  setLoading: (loading: boolean) => void;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      setItems: (items) => set({ items }),

      addItem: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.bookId === item.bookId);
          if (exists) return state;
          return { items: [item, ...state.items] };
        }),

      removeItem: (bookId) =>
        set((state) => ({
          items: state.items.filter((i) => i.bookId !== bookId),
        })),

      isInWishlist: (bookId) => {
        return get().items.some((i) => i.bookId === bookId);
      },

      setLoading: (loading) => set({ isLoading: loading }),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "purple-skull-wishlist",
    }
  )
);

// API functions for server sync (when logged in)
export const wishlistApi = {
  async fetchWishlist() {
    const response = await fetch("/api/wishlist");
    if (response.status === 401) {
      // User not authenticated, return empty wishlist
      return [];
    }
    if (!response.ok) throw new Error("Failed to fetch wishlist");
    return response.json();
  },

  async addToWishlist(bookId: string) {
    const response = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId }),
    });
    if (!response.ok) throw new Error("Failed to add to wishlist");
    return response.json();
  },

  async removeFromWishlist(bookId: string) {
    const response = await fetch(`/api/wishlist?bookId=${bookId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to remove from wishlist");
    return response.json();
  },
};
