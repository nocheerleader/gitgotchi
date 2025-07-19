import { useState, useEffect, useCallback } from 'react';
import { GitHubUser, CommitStats, PlantHealth } from '../types/github';
import { getGitHubUser, getUserEvents, GitHubApiError } from '../utils/githubApi';
import { calculateCommitStats, calculateHealth } from '../utils/healthCalculator';

interface GitHubState {
  user: GitHubUser | null;
  stats: CommitStats | null;
  health: PlantHealth | null;
  loading: boolean;
  error: string | null;
}

export const useGitHub = (username: string | null) => {
  const [state, setState] = useState<GitHubState>({
    user: null,
    stats: null,
    health: null,
    loading: false,
    error: null,
  });

  const fetchUserData = useCallback(async () => {
    if (!username) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const user = await getGitHubUser(username);
      const events = await getUserEvents(username);
      
      const stats = calculateCommitStats(events);
      const health = calculateHealth(stats.commitHistory);

      setState({
        user,
        stats,
        health,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof GitHubApiError 
        ? error.message 
        : 'An unexpected error occurred';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [username]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const refetch = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    ...state,
    refetch,
  };
};