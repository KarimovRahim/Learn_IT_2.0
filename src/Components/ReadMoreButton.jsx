import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ReadMoreButton = memo(({ to, children = "Подробнее" }) => {
  return (
    <Link
      to={to}
      className="group relative inline-flex items-center gap-2 px-6 py-3 overflow-hidden rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
    >
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ x: '-100%' }}
        whileHover={{ x: 0 }}
        transition={{ duration: 0.3 }}
        style={{ opacity: 0.2 }}
      />
      
      <motion.div
        animate={{ x: [0, 5, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ArrowRight className="w-4 h-4" />
      </motion.div>
      
      <span className="relative z-10">{children}</span>
      
      <motion.div
        className="absolute -right-1 -top-1 w-2 h-2 bg-white rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </Link>
  );
});

ReadMoreButton.displayName = 'ReadMoreButton';

export default ReadMoreButton;