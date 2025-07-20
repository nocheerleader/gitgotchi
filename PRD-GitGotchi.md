# GitGotchi - Product Requirements Document (PRD)
*A virtual plant companion that gamifies coding habits through GitHub commit tracking*

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Core Features](#core-features)
4. [Health Calculation System](#health-calculation-system)
5. [User Experience Flow](#user-experience-flow)
6. [Component Architecture](#component-architecture)
7. [Data Management](#data-management)
8. [Visual Design System](#visual-design-system)
9. [Development Setup](#development-setup)
10. [Future Roadmap](#future-roadmap)

---

## 🎯 Project Overview

### Vision Statement
GitGotchi transforms coding into a nurturing experience by connecting your GitHub commit activity to the health of a virtual plant companion. The more consistently you code, the healthier and happier your plant becomes.

### Target Audience
- **Primary**: Beginner to intermediate developers looking to build consistent coding habits
- **Secondary**: Experienced developers who enjoy gamification and visual progress tracking
- **Use Case**: Daily motivation for maintaining coding streaks and consistent development practices

### Core Value Proposition
- **Immediate Visual Feedback**: See your coding habits reflected in a living, animated plant
- **Gamification**: Turn daily coding into a caring responsibility for your virtual companion
- **Habit Formation**: Encourage consistent coding through positive reinforcement
- **Zero Setup**: Simple username input - no OAuth or complex authentication required

---

## 🏗️ Technical Architecture

### Tech Stack
```
Frontend Framework: React 18 + TypeScript
Styling: Tailwind CSS (utility-first CSS framework)
Animations: Framer Motion (declarative animations)
Icons: Lucide React (consistent icon library)
Build Tool: Vite (fast development server)
API Integration: GitHub REST API v3 (public data only)
State Management: React Hooks (useState, useEffect, custom hooks)
```

### Project Structure
```
gitgotchi/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Plant.tsx       # Main plant character with states
│   │   ├── HealthMeter.tsx # Visual health progress bar
│   │   ├── CommitStats.tsx # Statistics display
│   │   ├── UsernameInput.tsx # Initial user input
│   │   └── ThemeToggle.tsx # Dark/light mode
│   ├── hooks/              # Custom React hooks
│   │   └── useGitHub.tsx   # GitHub API data fetching
│   ├── utils/              # Business logic utilities
│   │   ├── githubApi.ts    # API communication layer
│   │   └── healthCalculator.ts # Health algorithm
│   ├── types/              # TypeScript type definitions
│   │   └── github.ts       # Data structure interfaces
│   ├── context/            # React context providers
│   │   └── ThemeContext.tsx # Theme state management
│   └── App.tsx             # Main application component
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

---

## ✨ Core Features

### 1. GitHub Integration
- **Simple Authentication**: Username-only input (no OAuth required)
- **Public Repository Tracking**: Monitors public commit activity
- **Real-time Data**: Fetches latest 100 GitHub events
- **Rate Limit Handling**: Graceful error handling for API limits (60 requests/hour)

### 2. Virtual Plant System
- **4 Distinct Health States**:
  - 🌺 **Thriving** (76-100 health): Vibrant flowers with sparkle animations
  - 🌿 **Healthy** (51-75 health): Lush green foliage with subtle glow
  - 🍃 **Sad** (26-50 health): Wilting leaves with muted colors
  - 🥀 **Dying** (0-25 health): Brown, withered appearance

- **Interactive Features**:
  - Hover animations and scaling effects
  - Speech bubbles with context-aware messages
  - Wobble animation when "feeding" the plant
  - Sparkle effects for thriving plants

### 3. Commit Statistics Dashboard
- **Current Streak**: Consecutive days with commits
- **Longest Streak**: Historical best performance
- **Total Commits**: 30-day commit count
- **Last Commit**: Time since last activity
- **Recent Activity**: List of recent commits with timestamps

### 4. Health Visualization
- **Dynamic Health Meter**: Color-coded progress bar (red → orange → green)
- **Trend Indicators**: Visual cues for improving/declining/stable health
- **Responsive Design**: Smooth animations and transitions

---

## 🧮 Health Calculation System

### Algorithm Overview
The plant health system uses a 30-day rolling window to calculate a health score from 0-100.

### Health Calculation Rules
```typescript
// Starting base health
let health = 50; // Middle ground starting point

// Daily commit bonus
+10 health points per day with commits

// Penalty system
-5 health points for missing 1 day
-15 health points per day for missing 3+ consecutive days

// Health boundaries
Math.max(0, Math.min(100, health)) // Capped between 0-100
```

### Plant State Mapping
```typescript
if (health >= 76) state = 'thriving';      // 🌺 Flowers & sparkles
else if (health >= 51) state = 'okay';     // 🌿 Healthy leaves
else if (health >= 26) state = 'sad';      // 🍃 Wilting
else state = 'dying';                      // 🥀 Withered
```

### Streak Calculation
- **Current Streak**: Counts consecutive days with commits from today backwards
- **Allows Grace Period**: Skips today if no commits yet (accommodates different time zones)
- **Longest Streak**: Historical maximum consecutive days with commits

### Trend Analysis
```typescript
// Compare recent week vs previous week
const recentCommits = commitHistory.filter(/* last 7 days */);
const olderCommits = commitHistory.filter(/* 7-14 days ago */);

if (recentCommits > olderCommits) trend = 'improving';
else if (recentCommits < olderCommits) trend = 'declining';
else trend = 'stable';
```

---

## 🎨 User Experience Flow

### 1. Initial Setup
```
User lands on app → Username input screen → Enter GitHub username → Data fetching begins
```

### 2. Loading States
```
Show animated loading plant → "Loading your GitGotchi..." → Fetch user + events data
```

### 3. Main Dashboard
```
Header: User info + controls → Plant section: Visual health state → Stats section: Numbers & metrics → Tips section: Encouragement
```

### 4. Interactive Elements
```
Refresh button → Re-fetch latest data
Plant click → Wobble animation + speech bubble
GitHub link → Open user's profile
Logout → Return to username input
```

### 5. Error Handling
```
User not found → Clear error message + retry option
Rate limit hit → Explanation + wait suggestion
Network error → Retry mechanism
```

---

## 🔧 Component Architecture

### App.tsx (Main Container)
- **Responsibilities**: State orchestration, routing logic, error boundaries
- **Key Features**: 
  - Username persistence (localStorage)
  - Loading 