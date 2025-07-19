# GitGotchi 🌱

A virtual plant companion that encourages consistent coding habits through GitHub commit tracking. Your plant's health reflects your coding consistency - the more you code, the healthier your plant becomes!

## Features

- **Virtual Plant Companion**: Watch your plant grow and thrive based on your coding habits
- **GitHub Integration**: Simple username-based tracking of public repository commits
- **Health System**: Dynamic plant health based on commit frequency over the last 30 days
- **Visual Feedback**: 4 distinct plant states with smooth animations
- **Commit Statistics**: Track streaks, total commits, and last commit date
- **Responsive Design**: Beautiful UI that works on all devices
- **Gamification**: Engaging micro-interactions and progress tracking

## Plant Health States

- **Thriving (76-100 health)**: 🌺 Vibrant flowers with sparkle effects
- **Healthy (51-75 health)**: 🌿 Lush green foliage
- **Sad (26-50 health)**: 🍃 Wilting leaves with muted colors
- **Dying (0-25 health)**: 🥀 Brown, withered appearance

## Health Calculation

- **Daily commit**: +10 health points
- **Miss 1 day**: -5 health points
- **Miss 3+ consecutive days**: -15 health points per day
- Health is calculated over the last 30 days and capped at 0-100

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd gitgotchi
npm install
```

### 2. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Using GitGotchi

1. Enter your GitHub username when prompted
2. GitGotchi will track your public repository commits
3. Watch your virtual plant's health change based on your coding consistency!

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **API**: GitHub REST API v3

## Important Notes

### Public Repositories Only
GitGotchi tracks commits from **public repositories only**. Private repository activity will not be reflected in your plant's health. This is a limitation of using GitHub's public API without authentication.

### Rate Limiting
The GitHub API has rate limits for unauthenticated requests:
- **60 requests per hour** per IP address
- If you hit the rate limit, you'll see an error message and need to wait before refreshing
- For higher rate limits, consider implementing GitHub OAuth authentication

### Privacy
- No authentication required - just enter your GitHub username
- Only public data is accessed
- No personal information is stored on our servers
- Username is saved locally in your browser for convenience

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development!

---

Happy coding! 🌱💻