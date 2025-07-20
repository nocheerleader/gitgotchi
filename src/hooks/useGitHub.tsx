import { useState, useEffect, useCallback } from 'react';
import { GitHubUser, CommitStats, PlantHealth } from '../types/github';
import { getGitHubUser, getUserEvents, GitHubApiError } from '../utils/githubApi';
import { calculateCommitStats, calculateHealth } from '../utils/healthCalculator';

interface GitHubState {
  user: GitHubUser | null;
  stats: CommitStats | null;
  health: PlantHealth | null;
  loading: boolean;
  refreshing: boolean; // Add separate refreshing state
  error: string | null;
  lastRefresh: Date | null; // Track last refresh time
}

export const useGitHub = (username: string | null) => {
  const [state, setState] = useState<GitHubState>({
    user: null,
    stats: null,
    health: null,
    loading: false,
    refreshing: false,
    error: null,
    lastRefresh: null,
  });

  const fetchUserData = useCallback(async (forceRefresh = false) => {
    if (!username) return;

    setState(prev => ({ 
      ...prev, 
      [forceRefresh ? 'refreshing' : 'loading']: true, 
      error: null 
    }));

    try {
      console.log(`Fetching data for ${username}${forceRefresh ? ' (force refresh)' : ''}`);
      
      const user = await getGitHubUser(username, forceRefresh);
      const events = await getUserEvents(username, forceRefresh);
      
      const stats = calculateCommitStats(events);
      const health = calculateHealth(stats.commitHistory);

      setState({
        user,
        stats,
        health,
        loading: false,
        refreshing: false,
        error: null,
        lastRefresh: new Date(),
      });
      
      console.log('Data fetched successfully');
    } catch (error) {
      console.error('Detailed error:', error);
      
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof GitHubApiError) {
        errorMessage = error.message;
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error - please check your internet connection and try again';
      } else if (error instanceof SyntaxError) {
        errorMessage = 'Invalid response from GitHub API';
      } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      setState(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: errorMessage,
      }));
    }
  }, [username]);

  useEffect(() => {
    fetchUserData(false);
  }, [fetchUserData]);

  const refetch = useCallback(() => {
    fetchUserData(true);
  }, [fetchUserData]);

  return {
    ...state,
    refetch,
  };
};