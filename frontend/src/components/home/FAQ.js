'use client';

import { useState } from 'react';
import styles from './FAQ.module.css';

const faqs = [
  {
    id: 'source',
    question: "Where is the source of Skardu Spring water?",
    answer: "Please check the label of the product you are ordering and ask our team for its source information. Request the relevant product details before you place an order."
  },
  {
    id: 'purification',
    question: "How is the water purified and filtered?",
    answer: "Please contact our team for the treatment and filtration details of the product you are ordering. Ask for the relevant product documentation and batch test results before deciding whether it meets your needs."
  },
  {
    id: 'certifications',
    question: "Where can I find quality and certification information?",
    answer: "You can read the quality documents linked on this website. For a batch’s test results or current certification documents, contact us before ordering and check the product and dates covered by each document."
  },
  {
    id: 'minerals',
    question: "How can I check the mineral content?",
    answer: "Use the product label and the relevant laboratory report to check mineral content, pH and other measurements. Contact us for information about a particular product or batch before ordering."
  },
  {
    id: 'delivery',
    question: "Where do you deliver within Pakistan?",
    answer: "We currently offer home and office delivery in Islamabad, Rawalpindi, Lahore and Karachi. Contact us with your location to confirm availability and delivery timing before placing an order."
  },
  {
    id: 'packaging',
    question: "What packaging sizes are available for purchase?",
    answer: "The current collection lists 500ml, 1 liter, 1.5 liter, 5 liter and 10 liter options. Check the product page for the size and pack you want before adding it to your cart."
  },
  {
    id: 'environment',
    question: "How should I dispose of the packaging?",
    answer: "Check the packaging for its material and recycling instructions, and follow the collection rules in your area. Contact us if you need information about the packaging for a particular product."
  },
  {
    id: 'storage',
    question: "How should I store Skardu Spring water?",
    answer: "Please follow the storage and use instructions printed on the product label. Contact our team if those instructions are unclear or if you need guidance for a particular product."
  },
  {
    id: 'subscription',
    question: "Do you offer subscription plans for regular delivery?",
    answer: "For regular deliveries to a home or office, contact us to discuss availability, scheduling and current pricing. Please confirm the arrangement before ordering."
  }
];

export default function FAQ() {
  const [activeId, setActiveId] = useState(null);

  const toggleAccordion = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className={styles.faq} id="faq">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>Common Questions</span>
          <h2 className={styles.title}>Everything you need to <span>know</span></h2>
        </div>

        <div className={styles.accordion}>
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className={`${styles.item} ${activeId === faq.id ? styles.itemActive : ''}`}
            >
              <button 
                type="button"
                id={`faq-question-${faq.id}`}
                aria-controls={`faq-answer-${faq.id}`}
                className={styles.question} 
                onClick={() => toggleAccordion(faq.id)}
                aria-expanded={activeId === faq.id}
              >
                <span className={styles.questionText}>{faq.question}</span>
                <span className={styles.icon} aria-hidden="true" />
              </button>
              <div className={styles.answer} id={`faq-answer-${faq.id}`} role="region" aria-labelledby={`faq-question-${faq.id}`} aria-hidden={activeId !== faq.id} inert={activeId !== faq.id}>
                <div className={styles.answerInner}>
                  <div className={styles.answerCopy}>{faq.answer}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
