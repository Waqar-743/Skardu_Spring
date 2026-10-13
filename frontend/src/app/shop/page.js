'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { IoSearchOutline, IoFilterOutline, IoStar, IoCloseOutline } from 'react-icons/io5';
import ProductCard from '@/components/shop/ProductCard';
import SkeletonCard from '@/components/shop/SkeletonCard';
import PRODUCTS, { CATEGORIES } from '@/data/products';
import useModalAccessibility from '@/lib/useModalAccessibility';
import styles from './Shop.module.css';

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(1000);
  const [minimumRating, setMinimumRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const sidebarRef = useRef(null);
  const closeFilters = useCallback(() => setMobileFiltersOpen(false), []);
  const shouldReduceMotion = useReducedMotion();
  useModalAccessibility(mobileFiltersOpen, sidebarRef, closeFilters, undefined, '#shop-filter-toggle');

  useEffect(() => {
    const closeOnDesktop = () => { if (window.innerWidth > 768) closeFilters(); };
    window.addEventListener('resize', closeOnDesktop, { passive: true });
    return () => window.removeEventListener('resize', closeOnDesktop);
  }, [closeFilters]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price <= priceRange;
      const matchesRating = product.rating >= minimumRating;
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    }).sort((a, b) => {
      if (sortBy === 'lowToHigh') return a.price - b.price;
      if (sortBy === 'highToLow') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.reviews - a.reviews;
      return 0;
    });
  }, [searchQuery, selectedCategory, sortBy, priceRange, minimumRating]);

  const activeFilterCount = [
    selectedCategory !== 'All',
    priceRange < 1000,
    searchQuery.length > 0,
    minimumRating > 0,
  ].filter(Boolean).length;

  return (
    <div className={styles.shopContainer}>
      <header className={styles.hero}>
        <motion.div 
          className="container"
          initial={shouldReduceMotion ? false : { y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className={styles.heroLabel}>The Collection / Skardu Spring</span>
          <h1>The Skardu <em>collection.</em></h1>
          <p>Choose your measure of the mountain. Find your everyday bottle or something to share.</p>
        </motion.div>
      </header>

      <main className={styles.mainContent}>
        <div className="container">
          {/* Mobile Filter Toggle */}
          <button 
            className={styles.mobileFilterToggle}
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            type="button"
            id="shop-filter-toggle"
            aria-expanded={mobileFiltersOpen}
            aria-controls="shop-filters"
          >
            <IoFilterOutline />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className={styles.filterBadge}>{activeFilterCount}</span>
            )}
          </button>

          <div className={styles.layout}>
            {/* Sidebar Filters */}
            <aside ref={sidebarRef} id="shop-filters" tabIndex={-1} role={mobileFiltersOpen ? 'dialog' : undefined} aria-modal={mobileFiltersOpen ? true : undefined} aria-label="Product filters" className={`${styles.sidebar} ${mobileFiltersOpen ? styles.sidebarOpen : ''}`}>
              <div className={styles.sidebarHeader}>
                <h3>Filters</h3>
                <button 
                  className={styles.closeSidebar}
                  onClick={closeFilters}
                  type="button"
                  aria-label="Close product filters"
                >
                  <IoCloseOutline />
                </button>
              </div>

              <div className={styles.searchBox}>
                <IoSearchOutline className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  id="shop-search"
                  aria-label="Search products"
                />
              </div>

              <div className={styles.filterSection}>
                <h3>Categories</h3>
                <div className={styles.categoryList}>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat} 
                      className={`${styles.categoryItem} ${selectedCategory === cat ? styles.active : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                      type="button"
                      aria-pressed={selectedCategory === cat}
                    >
                      {cat}
                      <span>{cat === 'All' ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat).length}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterSection}>
                <h3>Price Range</h3>
                <div className={styles.priceRange}>
                  <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    step="10"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className={styles.rangeInput}
                    id="price-range-slider"
                    aria-label="Maximum product price"
                    aria-valuetext={`Rs. ${priceRange}`}
                  />
                  <div className={styles.priceLabels}>
                    <span>Rs. 0</span>
                    <span>Rs. {priceRange}</span>
                  </div>
                </div>
              </div>

              <div className={styles.filterSection}>
                <h3>Minimum Rating</h3>
                <div className={styles.stars}>
                  {[5, 4, 3, 2, 1].map(star => (
                    <button key={star} type="button" className={`${styles.starRow} ${minimumRating === star ? styles.ratingActive : ''}`} aria-label={`${star} stars and up`} aria-pressed={minimumRating === star} onClick={() => setMinimumRating(minimumRating === star ? 0 : star)}>
                      <span className={styles.starIcons}>
                        {[...Array(5)].map((_, i) => <IoStar key={i} className={i < star ? undefined : styles.starEmpty} aria-hidden="true" />)}
                      </span>
                      <span className={styles.starLabel}>& Up</span>
                    </button>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  className={styles.clearFiltersBtn}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setPriceRange(1000);
                    setMinimumRating(0);
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </aside>

            {/* Overlay for mobile */}
            {mobileFiltersOpen && (
              <div 
                className={styles.sidebarOverlay} 
                onClick={() => setMobileFiltersOpen(false)}
              />
            )}

            {/* Product Grid Area */}
            <div className={styles.productsArea}>
              <div className={styles.toolbar}>
                <div className={styles.resultsCount} aria-live="polite">
                  Showing <strong>{filteredProducts.length}</strong> of {PRODUCTS.length} products
                </div>
                <div className={styles.sortWrapper}>
                  <label htmlFor="sort-select">Sort by:</label>
                  <select 
                    className={styles.sortSelect}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    id="sort-select"
                  >
                    <option value="featured">Featured</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                    <option value="rating">Average Rating</option>
                    <option value="newest">Most Reviewed</option>
                  </select>
                </div>
              </div>

              <div className={styles.productGrid}>
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    [...Array(6)].map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
                  ) : (
                    filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  )}
                </AnimatePresence>
              </div>

              {!isLoading && filteredProducts.length === 0 && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon} aria-hidden="true"><IoSearchOutline /></div>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search query.</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setPriceRange(1000);
                      setMinimumRating(0);
                    }}
                    className={styles.clearBtn}
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
