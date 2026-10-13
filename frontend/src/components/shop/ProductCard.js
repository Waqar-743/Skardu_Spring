'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { IoStar, IoCartOutline, IoHeartOutline, IoHeart } from 'react-icons/io5';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const shouldReduceMotion = useReducedMotion();
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  return (
    <motion.div 
      className={styles.card}
      initial={shouldReduceMotion ? false : { y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <button 
        className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ''}`}
        onClick={() => toggleWishlist(product)}
        aria-label={`${isWishlisted ? 'Remove' : 'Save'} ${product.name} ${isWishlisted ? 'from' : 'to'} wishlist`}
        aria-pressed={isWishlisted}
        type="button"
      >
        {isWishlisted ? <IoHeart /> : <IoHeartOutline />}
      </button>

      <Link href={`/shop/${product.id}`} className={styles.imageWrapper} aria-label={`View ${product.name}`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 50vw, (max-width: 1100px) 35vw, 24vw"
        />
      </Link>

      <div className={styles.content}>
        <span className={styles.category}>{product.category}</span>
        <Link href={`/shop/${product.id}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        
        <div className={styles.rating}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <IoStar key={i} className={i < Math.floor(product.rating) ? undefined : styles.emptyStar} aria-hidden="true" />
            ))}
          </div>
          <span className={styles.reviewCount}>({product.reviews} reviews)</span>
        </div>

        <div className={styles.footer}>
          <span className={styles.price}>Rs. {product.price}</span>
          <button 
            className={styles.addBtn}
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
            type="button"
          >
            <IoCartOutline />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
