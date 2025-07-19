import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-300 group"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="relative w-5 h-5">
        <AnimatePresence mode="wait">
          {theme === 'light' ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Sun className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Moon className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Hover tooltip */}
      <motion.div 
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded pointer-events-none whitespace-nowrap shadow-lg border border-border"
        initial={{ opacity: 0, y: -5 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {theme === 'light' ? 'Dark mode' : 'Light mode'}
      </motion.div>
    </motion.button>
  );
};