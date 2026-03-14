import { 
  ShoppingBag, 
  Carrot, 
  Apple, 
  Flame, 
  Leaf 
} from 'lucide-react';

export const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'Semua', icon: ShoppingBag },
  { id: 'sayuran', name: 'Sayuran', icon: Carrot },
  { id: 'buah', name: 'Buah', icon: Apple },
  { id: 'cabe_cabean', name: 'Cabe Cabean', icon: Flame },
  { id: 'rempah_rempah', name: 'Rempah-Rempah', icon: Flame },
  { id: 'bawang_bawangan', name: 'Bawang-Bawangan', icon: ShoppingBag },
  { id: 'biji_bijian', name: 'Biji-Bijian', icon: ShoppingBag },
  { id: 'kerupuk', name: 'Kerupuk', icon: ShoppingBag },
  { id: 'bumbu', name: 'Bumbu', icon: Flame },
  { id: 'Daun', name: 'Daun', icon: ShoppingBag },
  { id: 'lainnya', name: 'Lainnya', icon: Leaf },
];

export const PRODUCT_UNITS = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'ons', label: 'Ons' },
  { value: 'gram', label: 'Gram (g)' },
  { value: 'buah', label: 'Buah' },
  { value: 'ikat', label: 'Ikat' },
  { value: 'pack', label: 'Pack' },
  { value: 'botol', label: 'Botol' },
  { value: 'liter', label: 'Liter (L)' },
  { value: 'dos', label: 'Dos' },
];

// Helper function untuk mendapatkan kategori tanpa 'all'
export const getFilteredCategories = () => {
  return PRODUCT_CATEGORIES.filter(cat => cat.id !== 'all');
};
