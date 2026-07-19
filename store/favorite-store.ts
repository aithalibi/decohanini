import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteState {
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (productId) => {
        const currentFavorites = get().favorites;
        const exists = currentFavorites.includes(productId);
        if (exists) {
          set({
            favorites: currentFavorites.filter((id) => id !== productId),
          });
        } else {
          set({
            favorites: [...currentFavorites, productId],
          });
        }
      },
      isFavorite: (productId) => {
        return get().favorites.includes(productId);
      },
    }),
    {
      name: 'deco-hanini-favorites',
    }
  )
);
