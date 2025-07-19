import React, { useState } from 'react';
import { Calendar, GitCommit, Flame, Clock } from 'lucide-react';
import { CommitStats } from '../types/github';

interface CommitStatsProps {
  stats: CommitStats;
  className?: string;
}

export const CommitStatsComponent: React.FC<CommitStatsProps> = ({ stats, className = '' }) => {
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