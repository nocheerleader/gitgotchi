export interface GitHubUser {
  login: string;
  id: number;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    display_login: string;
    gravatar_id: string;
    url: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: any;
  public: boolean;
  created_at: string;
}

export interface CommitStats {
  totalCommits: number;
  currentStreak: number;
  longestStreak: number;
  lastCommitDate: Date | null;
  commitHistory: Date[];
}

export interface PlantHealth {
  current: number;
  state: 'thriving' | 'okay' | 'sad' | 'dying';
  trend: 'improving' | 'stable' | 'declining';
}