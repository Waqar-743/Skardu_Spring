'use client';

import { useRef, useCallback } from 'react';
import Image from '@/components/layout/SiteImage';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { IoClose, IoTrashOutline, IoCartOutline, IoArrowForward } from 'react-icons/io5';
import { useCart } from '@/context/CartContext';
import useModalAccessibility from '@/lib/useModalAccessibility';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const drawerRef = useRef(null);
  const closeRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const closeCart = useCallback(() => setIsCartOpen(false), [setIsCartOpen]);
  useModalAccessibility(isCartOpen, drawerRef, closeCart, closeRef, '#main-navbar button[aria-label^="Open cart"], #mobile-menu-toggle');

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={closeCart}
            aria-hidden="true"
          />
          <motion.div 
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            tabIndex={-1}
            className={styles.drawer}
            initial={{ x: reduceMotion ? 0 : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: reduceMotion ? 0 : '100%' }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <h2 id="cart-drawer-title">Your Cart</h2>
              <button ref={closeRef} type="button" onClick={closeCart} className={styles.closeBtn} aria-label="Close cart">
                <IoClose />
              </button>
            </div>

            <div className={styles.itemsList}>
              {cart.length === 0 ? (
                <div className={styles.empty}>
                  <IoCartOutline className={styles.emptyIcon} />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <Image src={item.image} alt={item.name} fill sizes="80px" style={{ objectFit: 'contain' }} />
                    </div>
                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemName}>{item.name}</h4>
                      <p className={styles.itemPrice}>Rs. {item.price}</p>
                      <div className={styles.itemControls}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button 
                            type="button"
                            aria-label={`Decrease ${item.name} quantity`}
                            className={styles.qtyBtn}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >-</button>
                          <span>{item.quantity}</span>
                          <button 
                            type="button"
                            aria-label={`Increase ${item.name} quantity`}
                            className={styles.qtyBtn}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >+</button>
                        </div>
                        <button 
                          type="button"
                          aria-label={`Remove ${item.name} from cart`}
                          className={styles.removeBtn}
                          onClick={() => removeFromCart(item.id)}
                        >
                          <IoTrashOutline />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.totalRow}>
                  <span>Total:</span>
                  <span>Rs. {cartTotal}</span>
                </div>
                <button className={styles.checkoutBtn} onClick={() => { setIsCartOpen(false); router.push('/checkout'); }}>
                  Proceed to Checkout <IoArrowForward />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
