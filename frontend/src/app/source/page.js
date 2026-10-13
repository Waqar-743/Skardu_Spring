'use client';

import { publicPath } from '@/lib/deployment';

import Image from '@/components/layout/SiteImage';
import { motion } from 'framer-motion';
import { IoLocationOutline, IoSnowOutline, IoWaterOutline, IoDocumentTextOutline } from 'react-icons/io5';
import { SOURCES } from '@/components/story/storyData';
import styles from './Source.module.css';

const milestones = [
  {
    icon: <IoSnowOutline />,
    title: 'Mountain snow',
    desc: 'Snowmelt contributes to river flows in the wider Indus basin.',
  },
  {
    icon: <IoWaterOutline />,
    title: 'Glaciers & rivers',
    desc: 'Glacier melt is another contributor to water availability across the basin.',
  },
  {
    icon: <IoLocationOutline />,
    title: 'The cultivated valley',
    desc: 'Water also supports irrigation and household use throughout the region.',
  },
  {
    icon: <IoDocumentTextOutline />,
    title: 'Know your bottle',
    desc: 'For product-specific source details, request the relevant information before ordering.',
  },
];

export default function SourcePage() {
  return (
    <div className={styles.sourceWrapper}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroMedia}><Image 
          src="/images/hero-bg.png" 
          alt="A mountain lake landscape" 
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
            The wider landscape
          </motion.span>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            A landscape <span>shaped by water.</span>
          </motion.h1>
          <motion.p 
            className={styles.desc}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Across the Karakoram and the Indus basin, snow, glaciers and rivers
            are part of daily life. Discover the regional story that inspires Skardu Spring.
          </motion.p>
        </div>
      </header>

      {/* Story Section */}
      <section className={styles.story}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>From the heights <span>to the valley.</span></h2>
              <p>
                Research from ICIMOD describes how snow and glacier melt contribute to water
                supply in the Indus basin, supporting households, agriculture and other uses.
                This is a story about the region and the water that connects it.
              </p>
              <p>
                For information about the water in a particular bottle, refer to its label
                and request the relevant source and quality documents from our team.
              </p>
              <a href={SOURCES[4].href} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Learn about snow and glacier melt <span aria-hidden="true">↗</span></a>
            </div>
            <div className={styles.imageContent}>
              <div className={styles.imageWrapper}>
                <Image 
                  src="/images/bottle-tilted-lake.png" 
                  alt="A Skardu Spring bottle beside a mountain lake" 
                  fill
                  sizes="(max-width: 767px) 100vw, 45vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline/Milestones */}
      <section className={styles.milestones}>
        <div className={styles.container}>
          <div className={styles.milestoneGrid}>
            {milestones.map((m, i) => (
              <motion.div 
                key={i} 
                className={styles.milestoneCard}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={styles.milestoneIcon}>{m.icon}</div>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* High Altitude Section */}
      <section className={styles.altitude}>
        <div className={styles.altitudeContent}>
          <h2 className={styles.sectionTitle}>Know what’s <span>in your glass.</span></h2>
          <p>
            Look at the product label, then ask us for the documents you need to make your
            choice. For batch test results, source information or certification details,
            contact the team before ordering.
          </p>
          <div className={styles.sourceActions}>
            <a href={publicPath('/assets/certs/gb-food-cert.pdf')} target="_blank" rel="noopener noreferrer" className={styles.textLink}>GB Food Authority document <span aria-hidden="true">↗</span></a>
            <a href={publicPath('/assets/certs/ALSCERT-UK-2025.pdf')} target="_blank" rel="noopener noreferrer" className={styles.textLink}>ALS UK laboratory document <span aria-hidden="true">↗</span></a>
            <a href="mailto:info@skarduspring.com" className={styles.textLink}>Ask the team <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </div>
  );
}
