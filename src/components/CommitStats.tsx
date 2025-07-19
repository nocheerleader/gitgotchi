import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Calendar, GitCommit, Flame, Clock } from 'lucide-react';
import { CommitStats } from '../types/github';

interface CommitStatsProps {
  stats: CommitStats;
  className?: string;
  onFeedPlant?: () => void;
}

export const CommitStatsComponent: React.FC<CommitStatsProps> = ({ 
  stats, 
  className = '',
  onFeedPlant 
}) => {
  const [showRecentCommits, setShowRecentCommits] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const formatLastCommitDate = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffDays === 0) {
      if (diffHours === 0) return 'Just now';
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const getRecentCommits = () => {
    const recent = stats.commitHistory.slice(0, 5);
    return recent.map(date => ({
      date,
      formatted: date.toLocaleDateString(),
      timeFormatted: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  };

  // Animated counter component
  const AnimatedCounter: React.FC<{ value: number; duration?: number }> = ({ value, duration = 1 }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, latest => Math.round(latest));
    
    React.useEffect(() => {
      const controls = animate(count, value, { duration });
      return controls.stop;
    }, [count, value, duration]);
    
    return <motion.span>{rounded}</motion.span>;
  };

  const handleFeedPlant = () => {
    // Create particle effect
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 100 - 50
    }));
    
    setParticles(newParticles);
    
    // Clear particles after animation
    setTimeout(() => setParticles([]), 2000);
    
    // Toggle recent commits
    setShowRecentCommits(!showRecentCommits);
    
    // Trigger plant wobble
    if (onFeedPlant) {
      onFeedPlant();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const StatCard: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    value: string | number; 
    color: string;
    delay?: number;
  }> = ({ icon, label, value, color, delay = 0 }) => (
    <motion.div 
      className="bg-card rounded-lg p-4 shadow-md border border-border"
      variants={cardVariants}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div 
        className="flex items-center space-x-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.3, duration: 0.4 }}
      >
        <motion.div 
          className={`p-2 rounded-lg ${color}`}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <div>
          <motion.p 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4, duration: 0.3 }}
          >
            {label}
          </motion.p>
          <motion.p 
            className="text-xl font-bold text-card-foreground"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.5, duration: 0.4, type: "spring" }}
          >
            {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div 
      className={`space-y-4 ${className}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-2 gap-4"
        variants={containerVariants}
      >
        <StatCard
          icon={<GitCommit className="w-5 h-5 text-white" />}
          label="Total Commits"
          value={stats.totalCommits}
          color="bg-blue-500"
          delay={0}
        />
        
        <StatCard
          icon={
            <motion.div
              animate={{ 
                scale: stats.currentStreak > 0 ? [1, 1.2, 1] : 1,
                rotate: stats.currentStreak > 0 ? [0, 10, -10, 0] : 0
              }}
              transition={{ 
                duration: 2, 
                repeat: stats.currentStreak > 0 ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <Flame className="w-5 h-5 text-white" />
            </motion.div>
          }
          label="Current Streak"
          value={`${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''}`}
          color="bg-orange-500"
          delay={0.1}
        />
        
        <StatCard
          icon={<Clock className="w-5 h-5 text-white" />}
          label="Last Commit"
          value={formatLastCommitDate(stats.lastCommitDate)}
          color="bg-green-500"
          delay={0.2}
        />
        
        <StatCard
          icon={<Calendar className="w-5 h-5 text-white" />}
          label="This Month"
          value={stats.commitHistory.length}
          color="bg-purple-500"
          delay={0.3}
        />
      </motion.div>

      {/* Feed Plant Button */}
      <motion.div 
        className="flex justify-center relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {/* Particle Effects */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-2xl pointer-events-none"
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0, 
              opacity: 1,
              rotate: 0
            }}
            animate={{ 
              x: particle.x, 
              y: particle.y, 
              scale: [0, 1, 0], 
              opacity: [1, 1, 0],
              rotate: 360
            }}
            transition={{ 
              duration: 2, 
              ease: "easeOut"
            }}
          >
            ✨
          </motion.div>
        ))}
        
        <motion.button
          onClick={handleFeedPlant}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)"
          }}
          whileTap={{ 
            scale: 0.95,
            boxShadow: "0 5px 15px rgba(34, 197, 94, 0.2)"
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="flex items-center space-x-2"
            whileTap={{ scale: 0.9 }}
          >
            <motion.span
              animate={{ rotate: showRecentCommits ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              🌱
            </motion.span>
            <span>Feed Plant</span>
            <motion.span 
              className="text-xs bg-white/20 px-2 py-1 rounded"
              animate={{ 
                backgroundColor: showRecentCommits ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)"
              }}
            >
              {showRecentCommits ? 'Hide' : 'Show'} Recent Commits
            </motion.span>
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Recent Commits Dropdown */}
      <motion.div
        initial={false}
        animate={{ 
          height: showRecentCommits ? "auto" : 0,
          opacity: showRecentCommits ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        {showRecentCommits && (
          <motion.div 
            className="bg-card rounded-lg shadow-lg border border-border overflow-hidden"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <motion.div 
              className="bg-muted px-4 py-3 border-b border-border"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <h3 className="font-semibold text-card-foreground">Recent Commits</h3>
            </motion.div>
            
            <div className="max-h-64 overflow-y-auto">
              {getRecentCommits().length > 0 ? (
                getRecentCommits().map((commit, index) => (
                  <motion.div
                    key={index}
                    className="px-4 py-3 border-b border-border last:border-b-0 hover:bg-accent transition-colors duration-200"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className="w-2 h-2 bg-green-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-sm font-medium text-card-foreground">
                          {commit.formatted}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {commit.timeFormatted}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="px-4 py-8 text-center text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <GitCommit className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  </motion.div>
                  <p>No commits found in the last 30 days</p>
                  <p className="text-xs mt-1">Start coding to feed your plant!</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Remove the old return statement and StatCard definition
export const CommitStatsComponent_OLD: React.FC<CommitStatsProps> = ({ stats, className = '' }) => {
  const [showRecentCommits, setShowRecentCommits] = useState(false);

  const formatLastCommitDate = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffDays === 0) {
      if (diffHours === 0) return 'Just now';
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const getRecentCommits = () => {
    const recent = stats.commitHistory.slice(0, 5);
    return recent.map(date => ({
      date,
      formatted: date.toLocaleDateString(),
      timeFormatted: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  };

  const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = 
    ({ icon, label, value, color }) => (
      <div className="bg-card rounded-lg p-4 shadow-md border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-xl font-bold text-card-foreground">{value}</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<GitCommit className="w-5 h-5 text-white" />}
          label="Total Commits"
          value={stats.totalCommits}
          color="bg-blue-500"
        />
        
        <StatCard
          icon={<Flame className="w-5 h-5 text-white" />}
          label="Current Streak"
          value={`${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''}`}
          color="bg-orange-500"
        />
        
        <StatCard
          icon={<Clock className="w-5 h-5 text-white" />}
          label="Last Commit"
          value={formatLastCommitDate(stats.lastCommitDate)}
          color="bg-green-500"
        />
        
        <StatCard
          icon={<Calendar className="w-5 h-5 text-white" />}
          label="This Month"
          value={stats.commitHistory.length}
          color="bg-purple-500"
        />
      </div>

      {/* Feed Plant Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowRecentCommits(!showRecentCommits)}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          <div className="flex items-center space-x-2">
            <span>🌱</span>
            <span>Feed Plant</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">
              {showRecentCommits ? 'Hide' : 'Show'} Recent Commits
            </span>
          </div>
        </button>
      </div>

      {/* Recent Commits Dropdown */}
      {showRecentCommits && (
        <div className="bg-card rounded-lg shadow-lg border border-border overflow-hidden transition-all duration-300 ease-in-out">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-card-foreground">Recent Commits</h3>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {getRecentCommits().length > 0 ? (
              getRecentCommits().map((commit, index) => (
                <div
                  key={index}
                  className="px-4 py-3 border-b border-border last:border-b-0 hover:bg-accent transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-card-foreground">
                        {commit.formatted}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {commit.timeFormatted}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-muted-foreground">
                <GitCommit className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No commits found in the last 30 days</p>
                <p className="text-xs mt-1">Start coding to feed your plant!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
};