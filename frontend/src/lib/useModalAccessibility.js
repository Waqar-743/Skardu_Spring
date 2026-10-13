'use client';

import { useEffect } from 'react';

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const openModals = [];
let savedBodyStyles;

function lockPage() {
  if (openModals.length !== 1) return;
  const body = document.body;
  savedBodyStyles = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
  const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
  body.style.overflow = 'hidden';
  if (scrollbarWidth) {
    body.style.paddingRight = `${parseFloat(window.getComputedStyle(body).paddingRight || '0') + scrollbarWidth}px`;
  }
}

function unlockPage() {
  if (openModals.length || !savedBodyStyles) return;
  document.body.style.overflow = savedBodyStyles.overflow;
  document.body.style.paddingRight = savedBodyStyles.paddingRight;
  savedBodyStyles = undefined;
}

// Keeps keyboard navigation inside an overlay, without changing scroll position.
export default function useModalAccessibility(isOpen, modalRef, onClose, initialFocusRef, fallbackFocusSelector) {
  useEffect(() => {
    const modal = modalRef.current;
    if (!isOpen || !modal) return undefined;

    const previousFocus = document.activeElement;
    const token = {};
    openModals.push(token);
    lockPage();

    const canFocus = (element) => element instanceof HTMLElement && element.isConnected
      && element.getClientRects().length > 0 && !element.matches(':disabled')
      && !element.closest('[inert]') && window.getComputedStyle(element).visibility !== 'hidden';
    const getFocusable = () => Array.from(modal.querySelectorAll(focusableSelector)).filter(canFocus);
    const focusFirst = () => (initialFocusRef?.current || getFocusable()[0] || modal).focus({ preventScroll: true });
    focusFirst();

    const onKeyDown = (event) => {
      if (openModals[openModals.length - 1] !== token) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'Tab') {
        const focusable = getFocusable();
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first) {
          event.preventDefault();
          modal.focus({ preventScroll: true });
        } else if (event.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        } else if (!event.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
          event.preventDefault();
          first.focus({ preventScroll: true });
        }
      }
    };
    const onFocusIn = (event) => {
      if (openModals[openModals.length - 1] === token && !modal.contains(event.target)) focusFirst();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
      const index = openModals.indexOf(token);
      if (index !== -1) openModals.splice(index, 1);
      unlockPage();
      // A second overlay may have taken over. Its focus trap owns focus now.
      if (openModals.length) return;
      const returnTargets = [previousFocus];
      if (fallbackFocusSelector) returnTargets.push(...document.querySelectorAll(fallbackFocusSelector));
      const returnTarget = returnTargets.find((element) => canFocus(element) && element.matches(focusableSelector));
      returnTarget?.focus({ preventScroll: true });
    };
  }, [isOpen, modalRef, onClose, initialFocusRef, fallbackFocusSelector]);
}
