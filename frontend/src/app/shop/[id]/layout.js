import PRODUCTS from '@/data/products';

export function generateStaticParams() {
  return PRODUCTS.map(({ id }) => ({ id }));
}

export default function ProductLayout({ children }) {
  return children;
}
