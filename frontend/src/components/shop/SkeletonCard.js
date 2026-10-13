'use client';

import styles from './SkeletonCard.module.css';

export default function SkeletonCard() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.image}></div>
      <div className={styles.content}>
        <div className={`${styles.line} ${styles.title}`}></div>
        <div className={`${styles.line} ${styles.text}`}></div>
        <div className={`${styles.line} ${styles.price}`}></div>
      </div>
    </div>
  );
}
