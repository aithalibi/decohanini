import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'FR' | 'AR';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'FR',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'deco-hanini-language',
    }
  )
);
