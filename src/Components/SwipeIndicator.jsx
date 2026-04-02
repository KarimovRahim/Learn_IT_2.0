import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SwipeIndicator = ({ direction, visible }) => {
  if (!visible) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: direction === 'left' ? -50 : 50 }}
        animate={{ opacity: 0.6, x: 0 }}
        exit={{ opacity: 0, x: direction === 'left' ? 50 : -50 }}
        transition={{ duration: 0.2 }}
        className={`fixed top-1/2 -translate-y-1/2 z-50 ${
          direction === 'left' ? 'left-4' : 'right-4'
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm shadow-lg flex items-center justify-center">
          {direction === 'left' ? (
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SwipeIndicator;