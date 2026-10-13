'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChatbubbleEllipsesOutline, IoCloseOutline, IoSend, IoWaterOutline, IoSparklesSharp } from 'react-icons/io5';
import styles from './Assistant.module.css';
import { hasServerAPI, apiPath } from '@/lib/deployment';

const QUICK_REPLIES = [
  { id: 'pricing', label: 'Check Pricing', query: 'What are the current prices for Skardu Spring water?' },
  { id: 'source', label: 'Water Source', query: 'Where does Skardu Spring water come from?' },
  { id: 'delivery', label: 'Delivery Info', query: 'How does your delivery system work?' },
  { id: 'quality', label: 'Product documents', query: 'How can I request certification or test documents for a product?' },
];

export default function Assistant() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 'initial-1', role: 'bot', content: 'Welcome to Skardu Spring. I can help with products, prices, delivery and ordering.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messageCounter = useRef(0);

  const nextId = (prefix) => {
    messageCounter.current += 1;
    return `${prefix}-${messageCounter.current}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
  };

  useEffect(() => {
    Promise.resolve().then(() => setIsMounted(true));
  }, []);

  useEffect(() => {
    if (isMounted) scrollToBottom();
  }, [messages, isTyping, isMounted]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeWithEscape = (event) => { if (event.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', closeWithEscape);
    return () => window.removeEventListener('keydown', closeWithEscape);
  }, [isOpen]);

  const handleSend = async (text) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    // Add user message with a unique ID generated at call time
    const userMessage = { id: nextId('msg'), role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(apiPath('chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const data = await response.json();
      
      if (data.response) {
        setMessages(prev => [...prev, { id: nextId('bot'), role: 'bot', content: data.response }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { id: nextId('err'), role: 'bot', content: data.error }]);
      } else {
        setMessages(prev => [...prev, { id: nextId('fallback'), role: 'bot', content: 'I am currently having a little trouble connecting, but you can explore all our products directly on our Shop page!' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: nextId('catch'), role: 'bot', content: 'I am currently having a little trouble connecting, but you can explore all our products directly on our Shop page!' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isMounted || !hasServerAPI) return null;

  return (
    <div className={styles.assistantWrapper}>
      {/* Floating Toggle Button */}
      <motion.button
        className={styles.toggleBtn}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close Assistant' : 'Open Assistant'}
        aria-expanded={isOpen}
        aria-controls="skardu-assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={false}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <IoCloseOutline />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={false}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <IoChatbubbleEllipsesOutline />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.chatWindow}
            id="skardu-assistant"
            role="region"
            aria-label="Skardu shopping assistant"
            initial={false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerInfo}>
                <div className={styles.avatar}>
                  <IoWaterOutline />
                </div>
                <div>
                  <h3>Skardu Assistant</h3>
                  <div className={styles.status}>
                    <span className={styles.dot}></span>
                    Online
                  </div>
                </div>
              </div>
              <IoSparklesSharp className={styles.sparkleIcon} />
            </div>

            {/* Messages Area */}
            <div className={styles.messagesArea} role="log" aria-live="polite" aria-label="Conversation">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.botMessage}`}
                >
                  {msg.content}
                </div>
              ))}
              {isTyping && (
                <div className={styles.typing}>
                  <span></span><span></span><span></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length < 3 && (
              <div className={styles.quickReplies}>
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply.id}
                    onClick={() => handleSend(reply.query)}
                    className={styles.quickReplyBtn}
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <form
              className={styles.inputArea}
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                type="text"
                placeholder="Ask me anything..."
                aria-label="Message to Skardu Assistant"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" aria-label="Send message" disabled={!inputValue.trim() || isTyping}>
                <IoSend />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
