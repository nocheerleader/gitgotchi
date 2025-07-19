import React from 'react';
import { motion } from 'framer-motion';

interface HealthMeterProps {
  health: number;
  className?: string;
}

export const HealthMeter: React.FC<HealthMeterProps> = ({ health, className = '' }) => {
  const getHealthColor = (health: number) => {
    if (health >= 76) return '#22C55E'; // Green
    if (health >= 51) return '#65A30D'; // Light green
    if (health >= 26) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  const getHealthGradient = (health: number) => {
    const color = getHealthColor(health);
    return `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`;
  };

  return (
    <motion.div 
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <motion.div 
        className="flex justify-between items-center mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <motion.span className="text-sm font-medium text-foreground">
          Plant Health
        </motion.span>
        <motion.span 
          className="text-sm font-bold" 
          style={{ color: getHealthColor(health) }}
          animate={{ color: getHealthColor(health) }}
          transition={{ duration: 0.5 }}
        >
          {health}/100
        </motion.span>
      </motion.div>
      
      <motion.div 
        className="w-full bg-muted h-4 overflow-hidden border border-border"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.div
          className="h-full relative overflow-hidden"
          style={{
            background: getHealthGradient(health),
          }}
          initial={{ width: '0%' }}
          animate={{ 
            width: `${health}%`,
            background: getHealthGradient(health)
          }}
          transition={{ 
            width: { duration: 1.5, ease: "easeOut" },
            background: { duration: 0.5 }
          }}
        >
          {/* Animated shine effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-30 animate-pulse"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
      
      {/* Health status indicators */}
      <motion.div 
        className="flex justify-between mt-2 text-xs text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <motion.span 
          className={health >= 76 ? 'font-semibold text-primary' : ''}
          animate={{ 
            scale: health >= 76 ? 1.1 : 1,
            color: health >= 76 ? '#00ff00' : undefined
          }}
          transition={{ duration: 0.3 }}
        >
          Thriving
        </motion.span>
        <motion.span 
          className={health >= 51 && health < 76 ? 'font-semibold text-primary' : ''}
          animate={{ 
            scale: health >= 51 && health < 76 ? 1.1 : 1,
            color: health >= 51 && health < 76 ? '#00ff00' : undefined
          }}
          transition={{ duration: 0.3 }}
        >
          Healthy
        </motion.span>
        <motion.span 
          className={health >= 26 && health < 51 ? 'font-semibold text-yellow-500' : ''}
          animate={{ 
            scale: health >= 26 && health < 51 ? 1.1 : 1,
            color: health >= 26 && health < 51 ? '#ffff00' : undefined
          }}
          transition={{ duration: 0.3 }}
        >
          Sad
        </motion.span>
        <motion.span 
          className={health < 26 ? 'font-semibold text-red-500' : ''}
          animate={{ 
            scale: health < 26 ? 1.1 : 1,
            color: health < 26 ? '#ff0000' : undefined
          }}
          transition={{ duration: 0.3 }}
        >
          Dying
        </motion.span>
      </motion.div>
      
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
};