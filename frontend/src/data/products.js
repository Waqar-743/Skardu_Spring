/**
 * Skardu Spring — Centralized Product Data
 * Single source of truth for all product information.
 * Used by: Shop page, Product Detail page, ProductShowcase, API routes.
 */

const PRODUCTS = [
  {
    id: 'artisanal-pure-500',
    name: 'Artisanal Pure',
    size: '500ml',
    category: 'Still Water',
    price: 60,
    originalPrice: 75,
    rating: 4.8,
    reviews: 124,
    image: '/images/bottle-500ml.png',
    shortDesc: 'A compact 500ml bottle for everyday plans.',
    description:
      'A 500ml still-water bottle that fits easily into a bag, a lunch setting or a short day out. A smaller format in the Skardu Spring collection.',
    specs: [
      'Size: 500ml',
      'pH: 7.4',
      'TDS: 120 mg/l',
      'Type: Still Water',
    ],
    minerals: ['Ca²⁺', 'Mg²⁺', 'K⁺'],
    popular: false,
    inStock: true,
  },
  {
    id: 'glacial-reserve-1000',
    name: 'Glacial Reserve',
    size: '1 Liter',
    category: 'Premium Still',
    price: 100,
    originalPrice: 130,
    rating: 4.9,
    reviews: 89,
    image: '/images/bottle-1l.png',
    shortDesc: 'A one-liter bottle for the table and the day ahead.',
    description:
      'Glacial Reserve is the one-liter format in our premium still-water collection. Set it on a shared table, pack it for the day or keep a bottle close while you work.',
    specs: [
      'Size: 1 Liter',
      'pH: 7.6',
      'TDS: 95 mg/l',
      'Type: Premium Still',
    ],
    minerals: ['Ca²⁺', 'Mg²⁺', 'SiO₂'],
    popular: true,
    inStock: true,
  },
  {
    id: 'mountain-essence-1500',
    name: 'Mountain Essence',
    size: '1.5 Liter',
    category: 'Still Water',
    price: 140,
    originalPrice: 170,
    rating: 4.7,
    reviews: 215,
    image: '/images/bottle-1.5l.png',
    shortDesc: 'The essence of Karakoram in every drop.',
    description:
      'The 1.5-liter Mountain Essence gives you a larger still-water format for shared meals, a family day out or everyday use at home.',
    specs: [
      'Size: 1.5 Liter',
      'pH: 7.4',
      'TDS: 110 mg/l',
      'Type: Still Water',
    ],
    minerals: ['Ca²⁺', 'Mg²⁺', 'HCO₃⁻'],
    popular: false,
    inStock: true,
  },
  {
    id: 'mega-hydrate-5000',
    name: 'Mega Hydrate',
    size: '5 Liter',
    category: 'Family Pack',
    price: 350,
    originalPrice: 420,
    rating: 4.6,
    reviews: 56,
    image: '/images/bottle-5l.png',
    shortDesc: 'Value pack for active families and groups.',
    description:
      'A five-liter family pack for keeping water ready at home or sharing with a group. The larger format suits kitchens, gatherings and daily routines.',
    specs: [
      'Size: 5 Liter',
      'pH: 7.5',
      'TDS: 115 mg/l',
      'Type: Family Pack',
    ],
    minerals: ['Ca²⁺', 'Mg²⁺', 'Na⁺'],
    popular: false,
    inStock: true,
  },
  {
    id: 'office-home-10000',
    name: 'Office & Home',
    size: '10 Liter',
    category: 'Bulk Pack',
    price: 600,
    originalPrice: 750,
    rating: 4.8,
    reviews: 42,
    image: '/images/bottle-5l.png',
    shortDesc: 'Bulk hydration solutions for your workplace or home.',
    description:
      "The ultimate hydration solution for professional environments. Our 10-liter bulk pack is designed for easy dispensing and consistent quality, bringing the freshness of Skardu to your office desk.",
    specs: [
      'Size: 10 Liter',
      'pH: 7.5',
      'TDS: 115 mg/l',
      'Type: Bulk Pack',
    ],
    minerals: ['Ca²⁺', 'Mg²⁺', 'HCO₃⁻'],
    popular: false,
    inStock: true,
  },
  {
    id: 'sparkling-glacier-500',
    name: 'Sparkling Glacier',
    size: '500ml',
    category: 'Sparkling',
    price: 120,
    originalPrice: 150,
    rating: 4.9,
    reviews: 31,
    image: '/images/bottle-500ml.png',
    shortDesc: 'Crisp, refreshing bubbles from the mountain depths.',
    description:
      'A 500ml sparkling option for a meal, a celebration or a change from still water. Serve chilled and enjoy alongside the food you love.',
    specs: [
      'Size: 500ml',
      'pH: 6.8',
      'Carbonation: Light/Natural',
      'TDS: 150 mg/l',
    ],
    minerals: ['Ca²⁺', 'Mg²⁺', 'CO₂'],
    popular: false,
    inStock: true,
  },
];

export const CATEGORIES = [
  'All',
  'Still Water',
  'Premium Still',
  'Family Pack',
  'Bulk Pack',
  'Sparkling',
];

export default PRODUCTS;
