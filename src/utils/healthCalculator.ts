import { CommitStats, PlantHealth } from '../types/github';

export const calculateCommitStats = (events: any[]): CommitStats => {
  // Filter for push events (commits) in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const commitEvents = events.filter(event => 
    event.type === 'PushEvent' && 
    new Date(event.created_at) >= thirtyDaysAgo
  );

  // Extract commit dates
  const commitDates = commitEvents.map(event => new Date(event.created_at));
  commitDates.sort((a, b) => b.getTime() - a.getTime()); // Sort newest first

  // Calculate total commits
  const totalCommits = commitDates.length;

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Group commits by day
  const commitsByDay = new Map<string, number>();
  commitDates.forEach(date => {
    const dayKey = date.toDateString();
    commitsByDay.set(dayKey, (commitsByDay.get(dayKey) || 0) + 1);
  });

  // Calculate current streak
  let checkDate = new Date(today);
  while (true) {
    const dayKey = checkDate.toDateString();
    if (commitsByDay.has(dayKey)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Allow one day gap for today if no commits yet
      if (currentStreak === 0 && checkDate.toDateString() === today.toDateString()) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  const allDays = Array.from(commitsByDay.keys()).sort();
  
  for (let i = 0; i < allDays.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(allDays[i - 1]);
      const currDate = new Date(allDays[i]);
      const dayDiff = Math.abs(currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    totalCommits,
    currentStreak,
    longestStreak,
    lastCommitDate: commitDates.length > 0 ? commitDates[0] : null,
    commitHistory: commitDates
  };
};

export const calculateHealth = (commitHistory: Date[]): PlantHealth => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  let health = 50; // Start at middle health
  
  // Create array of last 30 days
  const days = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toDateString());
  }
  
  // Group commits by day
  const commitsByDay = new Map<string, number>();
  commitHistory.forEach(date => {
    const dayKey = date.toDateString();
    commitsByDay.set(dayKey, (commitsByDay.get(dayKey) || 0) + 1);
  });
  
  // Calculate health based on commit pattern
  let consecutiveMisses = 0;
  
  for (const day of days) {
    if (commitsByDay.has(day)) {
      // Has commits this day
      health += 10;
      consecutiveMisses = 0;
    } else {
      // No commits this day
      consecutiveMisses++;
      
      if (consecutiveMisses === 1) {
        health -= 2; // Reduced penalty for missing one day (was -5)
      } else if (consecutiveMisses >= 5) {
        health -= 5; // Reduced penalty for consecutive misses (was -15, threshold was 3+)
      }
      // Days 2-4 have no additional penalty to be more forgiving
    }
  }
  
  // Cap health between 10 and 100 (minimum health floor increased from 0 to 10)
  health = Math.max(10, Math.min(100, health));
  
  // Determine plant state
  let state: PlantHealth['state'];
  if (health >= 76) state = 'thriving';
  else if (health >= 51) state = 'okay';
  else if (health >= 26) state = 'sad';
  else state = 'dying';
  
  // Determine trend (simplified)
  const recentCommits = commitHistory.filter(date => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  }).length;
  
  const olderCommits = commitHistory.filter(date => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= twoWeeksAgo && date < weekAgo;
  }).length;
  
  let trend: PlantHealth['trend'];
  if (recentCommits > olderCommits) trend = 'improving';
  else if (recentCommits < olderCommits) trend = 'declining';
  else trend = 'stable';
  
  return {
    current: health,
    state,
    trend
  };
};