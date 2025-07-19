import React, { useEffect, useState } from 'react';
import { RefreshCw, LogOut, Github, Heart, User } from 'lucide-react';
import { Plant } from './components/Plant';
import { HealthMeter } from './components/HealthMeter';
import { CommitStatsComponent } from './components/CommitStats';
import { UsernameInput } from './components/UsernameInput';
import { ThemeToggle } from './components/ThemeToggle';
import { useGitHub } from './hooks/useGitHub';

function App() {
  const [username, setUsername] = useState<string | null>(null);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🌱</div>
          <p className="text-muted-foreground text-lg">Loading your GitGotchi...</p>
        </div>
      </div>
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
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-xl">🌱</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">GitGotchi</h1>
                <p className="text-sm text-muted-foreground">
                  Hello, {user?.name || user?.login}!
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={refetch}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <ThemeToggle />
              
              <a
                href={`https://github.com/${user?.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200"
                title="View GitHub profile"
              >
                <Github className="w-5 h-5" />
              </a>
              
              <button
                onClick={handleLogout}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200"
                title="Change username"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Plant Section */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-border">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-card-foreground mb-2">Your Coding Companion</h2>
              <p className="text-muted-foreground">Keep coding to keep your plant healthy!</p>
            </div>
            
            {health && (
              <>
                <Plant health={health} className="mb-6" />
                <HealthMeter health={health.current} />
              </>
            )}
          </div>

          {/* Stats Section */}
          <div className="space-y-6">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-card-foreground mb-6">Commit Statistics</h2>
              {stats && <CommitStatsComponent stats={stats} />}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">💡 Pro Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-accent rounded-lg border border-border">
              <span className="text-3xl mb-3 block">🌱</span>
              <h3 className="font-semibold text-accent-foreground mb-2">Daily Commits</h3>
              <p className="text-sm text-muted-foreground">Commit code daily to keep your plant healthy and growing!</p>
            </div>
            
            <div className="text-center p-4 bg-accent rounded-lg border border-border">
              <span className="text-3xl mb-3 block">🔥</span>
              <h3 className="font-semibold text-accent-foreground mb-2">Build Streaks</h3>
              <p className="text-sm text-muted-foreground">Consistent coding creates longer streaks and happier plants!</p>
            </div>
            
            <div className="text-center p-4 bg-accent rounded-lg border border-border">
              <span className="text-3xl mb-3 block">📚</span>
              <h3 className="font-semibold text-accent-foreground mb-2">Learn & Grow</h3>
              <p className="text-sm text-muted-foreground">Every commit is a step forward in your coding journey!</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card/80 backdrop-blur-sm border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-muted-foreground">
            <p className="flex items-center justify-center space-x-2">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for developers who love to code</span>
            </p>
            <p className="text-sm mt-2">
              GitGotchi • Gamify your coding habits • Built with React & TypeScript
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;