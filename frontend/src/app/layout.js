import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MotionPreferences from '@/components/layout/MotionPreferences';
import HashNavigation from '@/components/layout/HashNavigation';
import Script from 'next/script';
import { FaWhatsapp } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const Assistant = dynamic(() => import('@/components/layout/Assistant'));

export const metadata = {
  title: 'Skardu Spring | A Place. A People. A Spring.',
  description: 'Discover Skardu Spring through the landscapes, living heritage and apricot orchards of Baltistan. Explore our water collection and the story behind the place.',
  keywords: 'skardu spring, mineral water, glacier water, karakoram water, pakistan water brand, premium water, natural spring water',
  openGraph: {
    title: 'Skardu Spring | Premium Natural Mineral Water',
    description: 'A journey through the mountains, rivers and living heritage of Baltistan.',
    type: 'website',
  },
};

import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import CartDrawer from '@/components/shop/CartDrawer';
import ToastContainer from '@/components/shop/Toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script id="structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Skardu Spring",
              "url": "https://skarduspring.com",
              "logo": "https://skarduspring.com/images/logo.png",
              "description": "Skardu Spring water and the landscapes and heritage of Baltistan.",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+923492899537",
                "contactType": "customer service"
              },
              "sameAs": [
                "https://facebook.com/skarduspring",
                "https://instagram.com/skarduspring"
              ]
            }
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <MotionPreferences>
        <ThemeProvider>
          <CartProvider>
            <a href="#main-content" className="skip-link">Skip to content</a>
            <Navbar />
            <HashNavigation />
            <main id="main-content" tabIndex={-1}>{children}</main>
            <Footer />
            <Assistant />
            <CartDrawer />
            <ToastContainer />
            <a 
              href="https://wa.me/923492899537" 
              target="_blank" 
              rel="noopener noreferrer"
              className="whatsapp-float"
              aria-label="Contact us on WhatsApp"
            >
              <FaWhatsapp />
            </a>
          </CartProvider>
        </ThemeProvider>
        </MotionPreferences>
      </body>
    </html>
  );
}
