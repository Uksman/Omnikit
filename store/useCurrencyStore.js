import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const currencies = [
  { label: 'Naira', value: 'NGN', symbol: '₦' },
  { label: 'Dollar', value: 'USD', symbol: '$' },
  { label: 'Euro', value: 'EUR', symbol: '€' },
  { label: 'Pound', value: 'GBP', symbol: '£' },
];

export const useCurrencyStore = create(
  persist(
    (set) => ({
      currency: currencies[0], // Default to Naira (₦)
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'currency-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
