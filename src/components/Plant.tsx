import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlantHealth } from '../types/github';

interface PlantProps {
  health: PlantHealth;
  className?: string;
  wobble?: boolean;
  onWobbleComplete?: () => void;
  streak?: number;
  showMessage?: boolean;
  onMessageComplete?: () => void;
}

export const Plant: React.FC<PlantProps> = ({ 
  health, 
  className = '', 
  wobble = false,
  onWobbleComplete,
  streak = 0,
  showMessage = false,
  onMessageComplete
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

  const getSpeechBubbleMessage = () => {
    if (showMessage) {
      return "Thanks for coding! 💚";
    }
    
    if (streak >= 7) {
      const messages = [
        "You're on fire! 🔥",
        "Amazing streak! 🚀",
        "Coding machine! ⚡",
        "Keep it up! 💪"
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    switch (health.state) {
      case 'thriving':
        const thrivingMessages = [
          "I'm flourishing! 🌟",
          "Life is good! ✨",
          "Thanks for caring! 💚",
          "We make a great team! 🤝"
        ];
        return thrivingMessages[Math.floor(Math.random() * thrivingMessages.length)];
      case 'okay':
        const okayMessages = [
          "Doing well! 😊",
          "Keep coding! 💻",
          "I believe in you! 🌱",
          "Steady progress! 📈"
        ];
        return okayMessages[Math.floor(Math.random() * okayMessages.length)];
      case 'sad':
        const sadMessages = [
          "I'm feeling lonely... 😔",
          "Missing your commits! 💔",
          "Code with me? 🥺",
          "I need some love! 💙"
        ];
        return sadMessages[Math.floor(Math.random() * sadMessages.length)];
      case 'dying':
        const dyingMessages = [
          "Help me grow! 🆘",
          "I need commits! 😵",
          "Don't give up on me! 💔",
          "Code saves lives! 🚨"
        ];
        return dyingMessages[Math.floor(Math.random() * dyingMessages.length)];
      default:
        return "Hello there! 👋";
    }
  };
  const getPlantColors = () => {
    switch (health.state) {
      case 'thriving':
        return {
          primary: '#22C55E',
          secondary: '#16A34A',
          accent: '#F59E0B',
          glow: '0 0 20px rgba(34, 197, 94, 0.5)',
        };
      case 'okay':
        return {
          primary: '#65A30D',
          secondary: '#4D7C0F',
          accent: '#84CC16',
          glow: '0 0 15px rgba(101, 163, 13, 0.3)',
        };
      case 'sad':
        return {
          primary: '#A3A3A3',
          secondary: '#737373',
          accent: '#D4D4D8',
          glow: 'none',
        };
      case 'dying':
        return {
          primary: '#A16207',
          secondary: '#92400E',
          accent: '#B45309',
          glow: 'none',
        };
      default:
        return {
          primary: '#22C55E',
          secondary: '#16A34A',
          accent: '#F59E0B',
          glow: '0 0 20px rgba(34, 197, 94, 0.5)',
        };
    }
  };

  const colors = getPlantColors();

  // Calculate plant size based on health
  const getPlantScale = () => {
    const baseScale = 1;
    const healthBonus = (health.current / 100) * 0.3; // Up to 30% bigger when healthy
    return baseScale + healthBonus;
  };
  // Animation variants for plant states
  const plantVariants = {
    thriving: { 
      y: 0, 
      rotate: 0, 
      scale: getPlantScale(),
      opacity: 1,
      boxShadow: colors.glow,
      transition: { duration: 0.8, ease: "easeOut" }
    },
    okay: { 
      y: 5, 
      rotate: 0, 
      scale: getPlantScale() * 0.95,
      opacity: 1,
      boxShadow: colors.glow,
      transition: { duration: 0.8, ease: "easeOut" }
    },
    sad: { 
      y: 10, 
      rotate: -5, 
      scale: getPlantScale() * 0.9,
      opacity: 0.8,
      boxShadow: colors.glow,
      transition: { duration: 0.8, ease: "easeOut" }
    },
    dying: { 
      y: 15, 
      rotate: -15, 
      scale: getPlantScale() * 0.8,
      opacity: 0.6,
      boxShadow: colors.glow,
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

  return (
    <motion.div 
      className={`flex flex-col items-center justify-center relative ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: 0
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {(showMessage || streak >= 7 || Math.random() < 0.1) && (
          <motion.div
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-card text-card-foreground px-4 py-2 border border-border text-sm font-medium whitespace-nowrap z-10"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onAnimationComplete={() => {
              if (onMessageComplete) {
                setTimeout(onMessageComplete, 3000);
              }
            }}
          >
            {getSpeechBubbleMessage()}
            {/* Speech bubble tail */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-card"></div>
          </motion.div>
        )}
      </AnimatePresence>
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
          className="absolute bottom-0 w-24 h-16 mx-auto left-1/2 transform -translate-x-1/2 transition-colors duration-500 border border-border"
          style={{
            background: colors.primary,
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />
        
        {/* Soil */}
        <motion.div 
          className="absolute bottom-2 w-20 h-3 mx-auto left-1/2 transform -translate-x-1/2 transition-colors duration-500 border border-border"
          style={{ backgroundColor: '#333' }}
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
                className="absolute top-2 left-8 text-primary"
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
                className="absolute top-6 right-6 text-primary"
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
                className="absolute top-12 left-6 text-primary"
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
          className="text-xl font-bold transition-colors duration-500 capitalize text-foreground drop-shadow-sm"
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