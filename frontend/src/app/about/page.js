'use client';

import Image from '@/components/layout/SiteImage';
import { motion } from 'framer-motion';
import { IoLeafOutline, IoGlobeOutline, IoConstructOutline, IoHeartOutline } from 'react-icons/io5';
import { SOURCES } from '@/components/story/storyData';
import styles from './About.module.css';

export default function AboutPage() {
  return (
    <div className={styles.aboutWrapper}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}><Image 
          src="/images/climber-peak.png" 
          alt="A climber holding a Skardu Spring bottle in a mountain scene" 
          fill 
          priority
          sizes="(max-width: 767px) 100vw, 48vw"
          className={styles.heroImg}
        /></div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <motion.span 
            className={styles.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Inspired by Baltistan
          </motion.span>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            The Legacy of <span>Skardu</span>
          </motion.h1>
          <motion.p 
            className={styles.desc}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Skardu Spring takes its inspiration from Baltistan’s mountains,
            river valleys and living heritage. A place to discover, and a story to share.
          </motion.p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className={styles.narrative}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.textSide}>
              <h2 className={styles.sectionTitle}>A place, and <span>its people.</span></h2>
              <p>
                Skardu sits among mountains, lakes and the Indus valley. Balti is the area’s
                native language, and its history reflects connections with South Asia,
                Central Asia and Tibet.
              </p>
              <p>
                That wider story guides the way we introduce Skardu Spring: through the
                landscape, local craftsmanship and the moments people share around a table.
                Explore the collection, and contact us when you need product or quality
                information before ordering.
              </p>
              <a href={SOURCES[0].href} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Read about Skardu <span aria-hidden="true">↗</span></a>
            </div>
            <div className={styles.visualSide}>
              <div className={styles.imageBox}>
                <Image 
                  src="/images/bottle-1l.png" 
                  alt="Skardu Spring Premium Bottle" 
                  width={400} 
                  height={600}
                  className={styles.bottleImg}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.values}>
        <div className={styles.container}>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <IoLeafOutline />
              <h3>Landscape</h3>
              <p>Peaks, valleys and lakes set the scene for the Skardu story.</p>
            </div>
            <div className={styles.valueCard}>
              <IoGlobeOutline />
              <h3>Living heritage</h3>
              <p>Balti language and local traditions give the region an identity that extends beyond its scenery.</p>
            </div>
            <div className={styles.valueCard}>
              <IoConstructOutline />
              <h3>Craftsmanship</h3>
              <p>The conservation of Shigar Fort helped bring local building techniques and wood carving back into use.</p>
              <a href={SOURCES[3].href} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Explore the craft story <span aria-hidden="true">↗</span></a>
            </div>
            <div className={styles.valueCard}>
              <IoHeartOutline />
              <h3>Shared moments</h3>
              <p>A glass of water, a meal and a conversation: an invitation to slow down and make room for one another.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
