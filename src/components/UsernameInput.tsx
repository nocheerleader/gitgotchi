import React, { useState } from 'react';
import { Github, Loader2, AlertCircle, User } from 'lucide-react';

interface UsernameInputProps {
  onUsernameSubmit: (username: string) => void;
  loading?: boolean;
  error?: string | null;
}

export const UsernameInput: React.FC<UsernameInputProps> = ({ 
  onUsernameSubmit, 
  loading = false, 
  error 
}) => {
  const [username, setUsername] = useState('');
  const [inputError, setInputError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim()) {
      setInputError('Please enter a GitHub username');
      return;
    }
    
    // GitHub username validation (basic)
    const usernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    if (!usernameRegex.test(username.trim())) {
      setInputError('Please enter a valid GitHub username');
      return;
    }
    
    setInputError('');
    onUsernameSubmit(username.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (inputError) setInputError('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card p-8 max-w-md w-full border border-border">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary border border-border flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🌱</span>
          </div>
          <h1 className="text-3xl font-bold text-card-foreground mb-2">GitGotchi</h1>
          <p className="text-muted-foreground leading-relaxed">
            Your virtual plant companion that grows with your coding habits!
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center space-x-3 text-sm text-card-foreground">
            <div className="w-8 h-8 bg-accent border border-border flex items-center justify-center">
              <span className="text-primary">🌿</span>
            </div>
            <span>Track your GitHub commit streaks</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-card-foreground">
            <div className="w-8 h-8 bg-accent border border-border flex items-center justify-center">
              <span className="text-primary">📊</span>
            </div>
            <span>Visualize your coding consistency</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-card-foreground">
            <div className="w-8 h-8 bg-accent border border-border flex items-center justify-center">
              <span className="text-primary">🎮</span>
            </div>
            <span>Gamify your development journey</span>
          </div>
        </div>

        {/* Error Messages */}
        {(error || inputError) && (
          <div className="mb-6 p-4 bg-background border border-destructive flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-destructive text-sm font-medium">Error</p>
              <p className="text-destructive text-sm mt-1">{error || inputError}</p>
            </div>
          </div>
        )}

        {/* Username Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-card-foreground mb-2">
              GitHub Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleInputChange}
                placeholder="Enter your GitHub username"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-input border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-foreground placeholder-muted-foreground disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground font-semibold py-4 px-6 border border-border transition-all duration-300 flex items-center justify-center space-x-3 transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Github className="w-5 h-5" />
                <span>Track My Commits</span>
              </>
            )}
          </button>
        </form>

        {/* Info Notice */}
        <div className="mt-6 p-4 bg-muted border border-border">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            We only access your public GitHub activity. No authentication required!
          </p>
        </div>
      </div>
    </div>
  );
};