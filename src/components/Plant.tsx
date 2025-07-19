import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlantHealth } from '../types/github';

interface PlantProps {
  health: PlantHealth;
  className?: string;
  wobble?: boolean;
  onWobbleComplete?: () => void;
}

export const Plant: React.FC<PlantProps> = ({ 
  health, 
  className = '', 
  wobble = false,
  onWobbleComplete 
}) => {
  const getPlantEmoji = () => {
    switch (health.state) {
      case 'thriving': return '🌺';
      case 'okay': return '🌿';
      case 'sad': return '🍃';
      case 'dying': return '🥀';
      default: return '🌱';
    }
  };

  const getPlantColors = () => {
    switch (health.state) {
      case 'thriving':
        return {
          primary: '#22C55E',
          secondary: '#16A34A',
          accent: '#F59E0B',
        };
      case 'okay':
        return {
          primary: '#65A30D',
          secondary: '#4D7C0F',
          accent: '#84CC16',
        };
      case 'sad':
        return {
          primary: '#A3A3A3',
          secondary: '#737373',
          accent: '#D4D4D8',
        };
      case 'dying':
        return {
          primary: '#A16207',
          secondary: '#92400E',
          accent: '#B45309',
        };
      default:
        return {
          primary: '#22C55E',
          secondary: '#16A34A',
          accent: '#F59E0B',
        };
    }
  };

  const colors = getPlantColors();

  // Animation variants for plant states
  const plantVariants = {
    thriving: { 
      y: 0, 
      rotate: 0, 
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    },
    okay: { 
      y: 5, 
      rotate: 0, 
      scale: 0.95,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    },
    sad: { 
      y: 10, 
      rotate: -5, 
      scale: 0.9,
      opacity: 0.8,
      transition: { duration: 0.8, ease: "easeOut" }
    },
    dying: { 
      y: 15, 
      rotate: -15, 
      scale: 0.8,
      opacity: 0.6,
      transition: { duration: 1, ease: "easeOut" }
    }
  };

  // Wobble animation for feeding
  const wobbleAnimation = wobble ? {
    rotate: [0, -10, 10, -10, 10, 0],
    scale: [1, 1.1, 1, 1.1, 1],
    transition: { 
      duration: 0.6, 
      ease: "easeInOut",
      onComplete: onWobbleComplete 
    }
  } : {};

  // Breathing animation for idle state
  const breathingAnimation = {
    scale: [1, 1.02, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div 
      className={`flex flex-col items-center justify-center ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        ...breathingAnimation
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Plant Character */}
      <motion.div 
        className="relative w-32 h-32 mb-4 transition-all duration-500 ease-in-out transform hover:scale-105"
        style={{
          filter: health.state === 'dying' ? 'grayscale(50%)' : 'none',
        }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Pot */}
        <motion.div 
          className="absolute bottom-0 w-24 h-16 mx-auto left-1/2 transform -translate-x-1/2 rounded-b-lg transition-colors duration-500"
          style={{
            background: `linear-gradient(145deg, ${colors.secondary}, ${colors.primary})`,
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />
        
        {/* Soil */}
        <motion.div 
          className="absolute bottom-2 w-20 h-3 mx-auto left-1/2 transform -translate-x-1/2 rounded transition-colors duration-500"
          style={{ backgroundColor: '#8B4513' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        />
        
        {/* Plant Emoji */}
        <motion.div 
          key={health.state} // Re-trigger animation on state change
          className="absolute top-0 left-1/2 transform -translate-x-1/2 text-6xl transition-all duration-500 ease-in-out"
          variants={plantVariants}
          initial="dying"
          animate={health.state}
          {...wobbleAnimation}
        >
          {getPlantEmoji()}
        </motion.div>
        
        {/* Sparkles for thriving state */}
        <AnimatePresence>
          {health.state === 'thriving' && (
            <>
              <motion.div 
                className="absolute top-2 left-8 text-yellow-400"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ✨
              </motion.div>
              <motion.div 
                className="absolute top-6 right-6 text-yellow-400"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  rotate: [0, -180, -360]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: 0.5,
                  ease: "easeInOut"
                }}
              >
                ✨
              </motion.div>
              <motion.div 
                className="absolute top-12 left-6 text-yellow-400"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  rotate: [0, 90, 180]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: 1,
                  ease: "easeInOut"
                }}
              >
                ✨
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Plant State Text */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <motion.h3 
          className="text-xl font-bold transition-colors duration-500 capitalize text-foreground"
          style={{ color: colors.primary }}
          animate={{ color: colors.primary }}
          transition={{ duration: 0.5 }}
        >
          {health.state === 'okay' ? 'Healthy' : health.state}
        </motion.h3>
        <motion.p 
          className="text-sm text-muted-foreground mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          {health.state === 'thriving' && 'Your plant is flourishing! Keep up the great work!'}
          {health.state === 'okay' && 'Your plant is doing well. Stay consistent!'}
          {health.state === 'sad' && 'Your plant needs attention. Code more often!'}
          {health.state === 'dying' && 'Your plant is struggling. Get back to coding!'}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};