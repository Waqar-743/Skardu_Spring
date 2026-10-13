'use client';

import { MotionConfig } from 'framer-motion';

export default function MotionPreferences({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
