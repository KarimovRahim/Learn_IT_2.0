import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, X, ChevronUp, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingButtons = () => {
  const [showButtons, setShowButtons] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowButtons(false);
  };

  const toggleButtons = () => {
    setShowButtons(!showButtons);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      
      {/* Кнопка скролла наверх */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={scrollToTop}
            className="group w-11 h-11 rounded-full bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-gray-200 dark:border-zinc-700"
          >
            <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Дополнительные кнопки (вылетают) */}
      <AnimatePresence>
        {showButtons && (
          <>
            <motion.a
              initial={{ opacity: 0, scale: 0.6, x: 30, y: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, x: 30, y: 20 }}
              transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
              href="tel:+992920091313"
              className="group w-11 h-11 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
            >
              <Phone className="w-5 h-5" />
            </motion.a>

            <motion.a
              initial={{ opacity: 0, scale: 0.6, x: 30, y: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, x: 30, y: 20 }}
              transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
              href="https://t.me/Learn_IT_academy_tj"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-11 h-11 rounded-full bg-[#0088cc] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </motion.a>
          </>
        )}
      </AnimatePresence>

      {/* Главная кнопка */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleButtons}
        className="relative w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        {/* Пульсирующий круг (эффект привлечения внимания) */}
        <motion.span
          className="absolute inset-0 rounded-full bg-red-500"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <AnimatePresence mode="wait">
          {showButtons ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Phone className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default FloatingButtons;