import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, LogOut, Github, Heart, User } from 'lucide-react';
import { Plant } from './components/Plant';
import { HealthMeter } from './components/HealthMeter';
import { CommitStatsComponent } from './components/CommitStats';
import { UsernameInput } from './components/UsernameInput';
import { ThemeToggle } from './components/ThemeToggle';
import { useGitHub } from './hooks/useGitHub';

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [plantWobble, setPlantWobble] = useState(false);
  const [showPlantMessage, setShowPlantMessage] = useState(false);
  const [inputLoading, setInputLoading] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  
  const { user, stats, health, loading, error, refetch } = useGitHub(username);

  // Load username from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('github_username');
    if (storedUsername && !username) {
      setUsername(storedUsername);
    }
  }, [username]);

  const handleUsernameSubmit = (newUsername: string) => {
    setInputLoading(true);
    setInputError(null);
    setUsername(newUsername);
    localStorage.setItem('github_username', newUsername);
    // Loading state will be handled by useGitHub hook
    setInputLoading(false);
  };

  const handleLogout = () => {
    setUsername(null);
    setInputError(null);
    localStorage.removeItem('github_username');
  };

  const handleFeedPlant = () => {
    setPlantWobble(true);
    setShowPlantMessage(true);
  };

  const handleWobbleComplete = () => {
    setPlantWobble(false);
  };

  const handleMessageComplete = () => {
    setShowPlantMessage(false);
  };
  // Show username input if not set
  if (!username) {
    return (
      <UsernameInput 
        onUsernameSubmit={handleUsernameSubmit} 
        loading={inputLoading} 
        error={inputError} 
      />
    );
  }

  // Show loading state  
  if (loading || inputLoading) {
    return (
      <motion.div 
        className="min-h-screen bg-background flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div 
            className="text-6xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🌱
          </motion.div>
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Loading your GitGotchi...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-border">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold text-card-foreground mb-4">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={refetch}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <User className="w-5 h-5" />
              <span>Change Username</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        className="bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border-b border-border sticky top-0 z-10 shadow-sm"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="text-muted-foreground/30 text-lg font-mono">{'{'}</span>
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-xl">🌱</span>
              </motion.div>
              <div>
                <motion.h1 
                  className="text-xl font-bold text-card-foreground drop-shadow-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  GitGotchi
                </motion.h1>
                <motion.p 
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  Hello, {user?.name || user?.login}!
                </motion.p>
              </div>
              <span className="text-muted-foreground/30 text-lg font-mono">{'}'}</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="text-muted-foreground/30 text-sm font-mono">;</span>
              <motion.button
                onClick={refetch}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 shadow-sm"
                title="Refresh data"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>
              
              <ThemeToggle />
              
              <motion.a
                href={`https://github.com/${user?.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 shadow-sm"
                title="View GitHub profile"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="w-5 h-5" />
              </motion.a>
              
              <motion.button
                onClick={handleLogout}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 shadow-sm"
                title="Change username"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <User className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        className="max-w-6xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <motion.div 
          className="grid lg:grid-cols-2 gap-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {/* Plant Section */}
          <motion.div 
            className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-border"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            whileHover={{ y: -5, boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }}
          >
            <motion.div 
              className="text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <motion.h2 
                className="text-2xl font-bold text-card-foreground mb-2 drop-shadow-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
              >
                Your Coding Companion
              </motion.h2>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
              >
                Keep coding to keep your plant healthy!
              </motion.p>
            </motion.div>
            
            {health && (
              <>
                <Plant 
                  health={health} 
                  className="mb-6" 
                  wobble={plantWobble}
                  onWobbleComplete={handleWobbleComplete}
                  streak={stats?.currentStreak || 0}
                  showMessage={showPlantMessage}
                  onMessageComplete={handleMessageComplete}
                />
                <HealthMeter health={health.current} />
              </>
            )}
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="space-y-6"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-border"
              whileHover={{ y: -5, boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }}
            >
              <motion.h2 
                className="text-2xl font-bold text-card-foreground mb-6 drop-shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                Commit Statistics
              </motion.h2>
              {stats && (
                <CommitStatsComponent 
                  stats={stats} 
                  onFeedPlant={handleFeedPlant}
                />
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Tips Section */}
        <motion.div 
          className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-border"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          whileHover={{ y: -5, boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }}
        >
          <motion.h2 
            className="text-2xl font-bold text-card-foreground mb-6 drop-shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            💡 Pro Tips
          </motion.h2>
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-accent to-accent/80 rounded-lg border border-border shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <span className="text-3xl mb-3 block">🌱</span>
              <h3 className="font-semibold text-accent-foreground mb-2 drop-shadow-sm">Daily Commits</h3>
              <p className="text-sm text-muted-foreground">Commit code daily to keep your plant healthy and growing!</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-accent to-accent/80 rounded-lg border border-border shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <span className="text-3xl mb-3 block">🔥</span>
              <h3 className="font-semibold text-accent-foreground mb-2 drop-shadow-sm">Build Streaks</h3>
              <p className="text-sm text-muted-foreground">Consistent coding creates longer streaks and happier plants!</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-accent to-accent/80 rounded-lg border border-border shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <span className="text-3xl mb-3 block">📚</span>
              <h3 className="font-semibold text-accent-foreground mb-2 drop-shadow-sm">Learn & Grow</h3>
              <p className="text-sm text-muted-foreground">Every commit is a step forward in your coding journey!</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <motion.footer 
        className="bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border-t border-border mt-16 shadow-sm"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <motion.div 
            className="text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            <motion.p 
              className="flex items-center justify-center space-x-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.9, duration: 0.4 }}
            >
              <span className="text-muted-foreground/30 font-mono">{'<'}</span>
              <span>Made with</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  filter: [
                    "drop-shadow(0 0 0px #ef4444)",
                    "drop-shadow(0 0 8px #ef4444)",
                    "drop-shadow(0 0 0px #ef4444)"
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="w-4 h-4 text-red-500" />
              </motion.div>
              <span>for developers who love to code</span>
              <span className="text-muted-foreground/30 font-mono">{'/>'}</span>
            </motion.p>
            <motion.p 
              className="text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.4 }}
            >
              GitGotchi • Gamify your coding habits • Built with React & TypeScript
            </motion.p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;