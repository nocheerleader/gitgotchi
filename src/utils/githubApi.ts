const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

export const getGitHubUser = async (username: string) => {
  const response = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubApiError(
        `User '${username}' not found. Please check the username and try again.`,
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

export const getUserEvents = async (username: string) => {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/events?per_page=100`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubApiError(
        `Events for user '${username}' not found.`,
        response.status
      );
    }
    if (response.status === 403) {
      throw new GitHubApiError(
        'Rate limit exceeded. Please try again later.',
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