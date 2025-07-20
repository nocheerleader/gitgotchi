const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

export const getGitHubUser = async (username: string, forceRefresh = false) => {
  // Add cache-busting parameter when forcing refresh (this works without CORS issues)
  const url = forceRefresh 
    ? `${GITHUB_API_BASE}/users/${username}?_=${Date.now()}`
    : `${GITHUB_API_BASE}/users/${username}`;
    
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      // Remove the problematic cache-control headers that cause CORS issues
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubApiError(
        `User '${username}' not found. Please check the username and try again.`,
        response.status
      );
    }
    if (response.status === 403) {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
      const waitTime = resetDate ? Math.ceil((resetDate.getTime() - Date.now()) / 60000) : 60;
      
      throw new GitHubApiError(
        `Rate limit exceeded. Please try again in ${waitTime} minutes.`,
        response.status
      );
    }
    throw new GitHubApiError(
      `Failed to fetch user: ${response.statusText}`,
      response.status
    );
  }
  
  return response.json();
};

export const getUserEvents = async (username: string, forceRefresh = false) => {
  // Add cache-busting parameter when forcing refresh (this works without CORS issues)
  const url = forceRefresh 
    ? `${GITHUB_API_BASE}/users/${username}/events?per_page=100&_=${Date.now()}`
    : `${GITHUB_API_BASE}/users/${username}/events?per_page=100`;
    
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      // Remove the problematic cache-control headers that cause CORS issues
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubApiError(
        `Events for user '${username}' not found.`,
        response.status
      );
    }
    if (response.status === 403) {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
      const waitTime = resetDate ? Math.ceil((resetDate.getTime() - Date.now()) / 60000) : 60;
      
      throw new GitHubApiError(
        `Rate limit exceeded. Please try again in ${waitTime} minutes.`,
        response.status
      );
    }
    throw new GitHubApiError(
      `Failed to fetch events: ${response.statusText}`,
      response.status
    );
  }
  
  return response.json();
};