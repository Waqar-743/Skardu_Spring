'use client';

import { useEffect, useRef } from 'react';
import Image from '@/components/layout/SiteImage';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PRODUCTS from '@/data/products';
import { useCart } from '@/context/CartContext';
import styles from './Collection.module.css';

gsap.registerPlugin(ScrollTrigger);

const FEATURED_IDS = [
  'artisanal-pure-500',
  'glacial-reserve-1000',
  'mountain-essence-1500',
  'sparkling-glacier-500',
];

const FEATURED = FEATURED_IDS.map((id) => PRODUCTS.find((product) => product.id === id)).filter(Boolean);

export default function Collection() {
  const rootRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();

    mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 768px)' }, ({ conditions }) => {
      if (!conditions.motion) return;

      gsap.utils.toArray('[data-fade]', root).forEach((target) => {
        gsap.fromTo(target, { opacity: target.tagName === 'P' ? 1 : 0.72, y: conditions.desktop ? 28 : 12 }, {
          opacity: 1, y: 0, ease: 'none',
          scrollTrigger: { trigger: target, start: 'top 95%', end: 'top 72%', scrub: 0.5 },
        });
      });

      if (!conditions.desktop) return;
      // Scroll moves an outer wrapper; hover scales its child independently.
      gsap.utils.toArray('[data-drift]', root).forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: 4 + (i % 2) * 2 },
          {
            yPercent: -4 - (i % 2) * 2,
            ease: 'none',
            scrollTrigger: { trigger: el.closest('[data-media]'), start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          }
        );
      });
    }, root);

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.collection} id="product-showcase">
      <div className={styles.inner}>
        <header className={styles.head}>
          <div>
            <p className={styles.kicker} data-fade>
              The Collection
            </p>
            <h2 className={styles.title} data-fade>
              Choose your <em>measure</em> of the mountain.
            </h2>
          </div>
          <Link href="/shop" className={styles.all}>
            View all products
            <span aria-hidden="true">→</span>
          </Link>
        </header>

        <ul className={styles.grid}>
          {FEATURED.map((product, i) => (
            <li key={product.id} className={styles.card}>
              <Link href={`/shop/${product.id}`} className={styles.media} aria-label={product.name} data-media>
                <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
                {product.popular && <span className={styles.badge}>Most loved</span>}
                <span className={styles.imageDrift} data-drift>
                  <span className={styles.imageWrap}>
                    <Image
                      src={product.image}
                      alt={`${product.name}, ${product.size}`}
                      fill
                      sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 25vw"
                      className={styles.image}
                    />
                  </span>
                </span>
              </Link>

              <div className={styles.meta}>
                <p className={styles.category}>
                  {product.category} · {product.size}
                </p>
                <h3 className={styles.name} data-fade>{product.name}</h3>
                <p className={styles.desc} data-fade>{product.shortDesc}</p>
                <div className={styles.buy}>
                  <span className={styles.price}>Rs. {product.price}</span>
                  <button
                    type="button"
                    className={styles.add}
                    onClick={() => addToCart(product)}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
