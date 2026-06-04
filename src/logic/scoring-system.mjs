/**
 * ProsperCity — Scoring System
 * 
 * Pure ES module for tracking gameplay progress, stars earned,
 * badges unlocked, and location/scenario completion status.
 */

// ─── Constants ───────────────────────────────────────────────────

export const STAR_EARNING_RULES = {
  SCENARIO_COMPLETE: 2,
  SCENARIO_PERFECT: 3,
  FIRST_TIME_BONUS: 1,
  DAILY_LOGIN: 1,
  AFFIRMATION_BELIEVE: 1,
  JOURNAL_ENTRY: 1
};

export const STAR_MILESTONES = [
  { stars: 0, unlock: 'home-base', label: 'Home Base' },
  { stars: 3, unlock: 'the-bank', label: 'The Bank' },
  { stars: 6, unlock: 'travel-agency', label: 'Travel Agency' },
  { stars: 10, unlock: 'emergency-hq', label: 'Emergency HQ' },
  { stars: 15, unlock: 'confidence-corner', label: 'Confidence Corner (Full Access)' },
  { stars: 20, unlock: 'investment-island', label: 'Investment Island' },
  { stars: 25, unlock: 'challenge-mode', label: 'Challenge Mode' }
];

export const BADGES = {
  FIRST_STAR: { id: 'first-star', name: 'First Star', description: 'Earned your first star!', icon: '⭐' },
  BUDGET_BEGINNER: { id: 'budget-beginner', name: 'Budget Beginner', description: 'Completed first budget scenario', icon: '📊' },
  BUDGET_MASTER: { id: 'budget-master', name: 'Budget Master', description: 'Perfect score on 50/30/20 rule', icon: '🏆' },
  DTI_EXPLORER: { id: 'dti-explorer', name: 'DTI Explorer', description: 'Calculated your first DTI ratio', icon: '📐' },
  DTI_PRO: { id: 'dti-pro', name: 'DTI Pro', description: 'Correctly calculated 3 DTI scenarios', icon: '💹' },
  TRAVEL_PLANNER: { id: 'travel-planner', name: 'Travel Planner', description: 'Planned a trip on budget', icon: '✈️' },
  HIDDEN_COST_HUNTER: { id: 'hidden-cost-hunter', name: 'Hidden Cost Hunter', description: 'Found all hidden costs', icon: '🔍' },
  SHIELD_BUILDER: { id: 'shield-builder', name: 'Shield Builder', description: 'Set up an emergency fund goal', icon: '🛡️' },
  EMERGENCY_HERO: { id: 'emergency-hero', name: 'Emergency Hero', description: 'Survived 3 emergency events', icon: '🦸' },
  CONFIDENCE_BOOST: { id: 'confidence-boost', name: 'Confidence Boost', description: 'Visited Confidence Corner 5 times', icon: '☀️' },
  INVESTOR_NOVICE: { id: 'investor-novice', name: 'Investor Novice', description: 'Bought your first stock', icon: '📈' },
  STAR_COLLECTOR: { id: 'star-collector', name: 'Star Collector', description: 'Earned 25 stars total', icon: '🌟' },
  ALL_SCENARIOS: { id: 'all-scenarios', name: 'Completionist', description: 'Completed every scenario', icon: '💎' }
};

export const LOCATIONS = [
  { id: 'home-base', label: 'Home Base', emoji: '🏠', prerequisites: [] },
  { id: 'the-bank', label: 'The Bank', emoji: '🏦', prerequisites: ['home-base'] },
  { id: 'travel-agency', label: 'Travel Agency', emoji: '✈️', prerequisites: ['the-bank'] },
  { id: 'emergency-hq', label: 'Emergency HQ', emoji: '🛡️', prerequisites: ['travel-agency'] },
  { id: 'confidence-corner', label: 'Confidence Corner', emoji: '☀️', prerequisites: [] },
  { id: 'investment-island', label: 'Investment Island', emoji: '🏝️', prerequisites: ['emergency-hq'] }
];

export const SCENARIOS_BY_LOCATION = {
  'home-base': [
    { id: 'my-first-paycheck', label: 'My First Paycheck', starValue: 2 },
    { id: 'bills-bills-bills', label: 'Bills, Bills, Bills', starValue: 2, prerequisite: 'my-first-paycheck' },
    { id: 'the-50-30-20-rule', label: 'The 50/30/20 Rule', starValue: 2, prerequisite: 'bills-bills-bills' }
  ],
  'the-bank': [
    { id: 'what-is-debt', label: 'What Is Debt?', starValue: 2, prerequisite: 'my-first-paycheck' },
    { id: 'dti-challenge', label: 'The DTI Challenge', starValue: 2, prerequisite: 'what-is-debt' }
  ],
  'travel-agency': [
    { id: 'plan-a-trip', label: 'Plan-a-Trip', starValue: 2, prerequisite: 'dti-challenge' },
    { id: 'the-hidden-costs', label: 'The Hidden Costs', starValue: 2, prerequisite: 'plan-a-trip' }
  ],
  'emergency-hq': [
    { id: '3-6-month-rule', label: 'The 3-6 Month Rule', starValue: 2, prerequisite: 'plan-a-trip' },
    { id: 'rainy-day-simulator', label: 'Rainy Day Simulator', starValue: 2, prerequisite: '3-6-month-rule' }
  ],
  'confidence-corner': [
    { id: 'daily-affirmation', label: 'Daily Affirmation Visit', starValue: 1 }
  ],
  'investment-island': [
    { id: 'what-is-a-stock', label: 'What Is a Stock?', starValue: 2, prerequisite: '3-6-month-rule' }
  ]
};

// ─── Player Profile Creation ─────────────────────────────────────

/**
 * Create a new player profile.
 * @param {string} name - Player's name
 * @param {number} age - Player's age
 * @param {string} avatar - Avatar ID
 * @param {object} income - Income info { source, amount, nickname }
 * @returns {object} Fresh player profile
 */
export function createPlayerProfile(name, age, avatar = 'ava', income = null) {
  return {
    name,
    age,
    avatar,
    createdAt: new Date().toISOString(),
    lastPlayedAt: new Date().toISOString(),
    income: income || { source: 'allowance', amount: 0, nickname: 'My Income' },
    stars: 0,
    starsEarned: {},
    completedScenarios: [],
    completedLocations: [],
    badges: [],
    visitedAffirmations: [],
    journalEntries: [],
    currentLocation: 'home-base',
    sessionStreak: 0,
    totalPlayTime: 0
  };
}

// ─── Star Management ─────────────────────────────────────────────

/**
 * Add stars to a player profile.
 * @param {object} profile - Player profile (mutated in place, also returned)
 * @param {number} amount - Number of stars to add
 * @param {string} reason - Reason for earning stars
 * @returns {object} Updated profile + star event
 */
export function addStars(profile, amount, reason = 'scenario-complete') {
  if (!profile || typeof profile.stars !== 'number') {
    throw new Error('Invalid player profile');
  }

  const previousStars = profile.stars;
  profile.stars += amount;
  profile.lastPlayedAt = new Date().toISOString();

  if (!profile.starsEarned[reason]) {
    profile.starsEarned[reason] = 0;
  }
  profile.starsEarned[reason] += amount;

  const newUnlocks = checkMilestones(previousStars, profile.stars);
  const newBadges = checkBadgesOnStars(profile, amount);

  return {
    profile,
    starsAdded: amount,
    totalStars: profile.stars,
    reason,
    newUnlocks,
    newBadges
  };
}

/**
 * Check which milestones are newly unlocked between star counts.
 * @param {number} previousStars
 * @param {number} currentStars
 * @returns {Array} Newly unlocked milestones
 */
function checkMilestones(previousStars, currentStars) {
  return STAR_MILESTONES.filter(m =>
    m.stars > 0 &&
    m.stars > previousStars &&
    m.stars <= currentStars
  ).map(m => ({ ...m, justUnlocked: true }));
}

/**
 * Check if any badges should be awarded based on star count.
 */
function checkBadgesOnStars(profile, starsAdded) {
  const newBadges = [];
  const ownedIds = profile.badges.map(b => b.id);

  if (profile.stars >= 1 && !ownedIds.includes('first-star')) {
    newBadges.push(BADGES.FIRST_STAR);
  }
  if (profile.stars >= 25 && !ownedIds.includes('star-collector')) {
    newBadges.push(BADGES.STAR_COLLECTOR);
  }

  return newBadges;
}

// ─── Scenario Completion ─────────────────────────────────────────

/**
 * Mark a scenario as completed.
 * @param {object} profile
 * @param {string} scenarioId
 * @param {number} starsEarned - Stars earned from this scenario (1-3)
 * @returns {object} Updated profile + rewards
 */
export function completeScenario(profile, scenarioId, starsEarned = 2) {
  if (profile.completedScenarios.includes(scenarioId)) {
    return { profile, alreadyCompleted: true, starsEarned: 0 };
  }

  const locationId = findLocationForScenario(scenarioId);
  profile.completedScenarios.push(scenarioId);
  profile.lastPlayedAt = new Date().toISOString();

  const starResult = addStars(profile, starsEarned, `scenario:${scenarioId}`);

  // Check if all scenarios in a location are done
  if (locationId && isLocationComplete(profile, locationId)) {
    if (!profile.completedLocations.includes(locationId)) {
      profile.completedLocations.push(locationId);
    }
  }

  return {
    profile,
    alreadyCompleted: false,
    starsEarned,
    ...starResult
  };
}

/**
 * Find which location a scenario belongs to.
 */
function findLocationForScenario(scenarioId) {
  for (const [locId, scenarios] of Object.entries(SCENARIOS_BY_LOCATION)) {
    if (scenarios.some(s => s.id === scenarioId)) return locId;
  }
  return null;
}

/**
 * Check if all scenarios in a location are completed.
 */
export function isLocationComplete(profile, locationId) {
  const scenarios = SCENARIOS_BY_LOCATION[locationId];
  if (!scenarios) return false;
  return scenarios.every(s => profile.completedScenarios.includes(s.id));
}

// ─── Location Access ─────────────────────────────────────────────

/**
 * Check if a location is unlocked for a player.
 * @param {object} profile
 * @param {string} locationId
 * @returns {boolean}
 */
export function isLocationUnlocked(profile, locationId) {
  const location = LOCATIONS.find(l => l.id === locationId);
  if (!location) return false;

  // Confidence Corner is always available
  if (locationId === 'confidence-corner') return true;

  // Check star threshold
  const milestone = STAR_MILESTONES.find(m => m.unlock === locationId);
  if (milestone && profile.stars < milestone.stars) return false;

  // Check prerequisites
  if (location.prerequisites.length > 0) {
    return location.prerequisites.every(pre => profile.completedLocations.includes(pre));
  }

  return true;
}

/**
 * Get all available (unlocked) locations for a player.
 * @param {object} profile
 * @returns {Array} Unlocked locations with status
 */
export function getAvailableLocations(profile) {
  return LOCATIONS.map(loc => ({
    ...loc,
    unlocked: isLocationUnlocked(profile, loc.id),
    completed: profile.completedLocations.includes(loc.id),
    progress: getLocationProgress(profile, loc.id)
  }));
}

/**
 * Get progress percentage for a location.
 */
export function getLocationProgress(profile, locationId) {
  const scenarios = SCENARIOS_BY_LOCATION[locationId];
  if (!scenarios || scenarios.length === 0) return 0;

  const completed = scenarios.filter(s => profile.completedScenarios.includes(s.id)).length;
  return Math.round((completed / scenarios.length) * 100);
}

// ─── Badge Management ────────────────────────────────────────────

/**
 * Award a badge to a player.
 * @param {object} profile
 * @param {string} badgeId - Key from BADGES object
 * @returns {object} Updated profile + badge info
 */
export function awardBadge(profile, badgeId) {
  const badge = BADGES[badgeId];
  if (!badge) throw new Error(`Unknown badge: ${badgeId}`);

  if (profile.badges.some(b => b.id === badge.id)) {
    return { profile, alreadyOwned: true };
  }

  profile.badges.push({ ...badge, awardedAt: new Date().toISOString() });
  return { profile, alreadyOwned: false, badge };
}

// ─── Journal ──────────────────────────────────────────────────────

/**
 * Add a journal entry.
 * @param {object} profile
 * @param {string} text - Journal text
 * @param {string} prompt - The journal prompt
 * @returns {object} Updated profile
 */
export function addJournalEntry(profile, text, prompt = '') {
  const entry = {
    id: `journal-${Date.now()}`,
    prompt,
    text,
    createdAt: new Date().toISOString()
  };

  profile.journalEntries.push(entry);
  profile.lastPlayedAt = new Date().toISOString();

  return { profile, entry };
}

// ─── Score Aggregation ────────────────────────────────────────────

/**
 * Get a full summary of a player's progress.
 * @param {object} profile
 * @returns {object} Progress summary
 */
export function getProgressSummary(profile) {
  const totalScenarios = Object.values(SCENARIOS_BY_LOCATION).reduce(
    (sum, s) => sum + s.length, 0
  );

  return {
    name: profile.name,
    age: profile.age,
    avatar: profile.avatar,
    stars: profile.stars,
    nextMilestone: STAR_MILESTONES.find(m => m.stars > profile.stars) || null,
    completedScenarios: profile.completedScenarios.length,
    totalScenarios,
    completionPercent: Math.round((profile.completedScenarios.length / totalScenarios) * 100),
    completedLocations: profile.completedLocations.length,
    totalLocations: LOCATIONS.length,
    badges: profile.badges,
    journalEntries: profile.journalEntries.length,
    locations: getAvailableLocations(profile)
  };
}

/**
 * Get the next star milestone a player is working toward.
 */
export function getNextMilestone(profile) {
  for (const milestone of STAR_MILESTONES) {
    if (milestone.stars > profile.stars) {
      return {
        ...milestone,
        starsNeeded: milestone.stars - profile.stars,
        progressPercent: Math.round((profile.stars / milestone.stars) * 100)
      };
    }
  }
  return null;
}

export default {
  createPlayerProfile,
  addStars,
  completeScenario,
  isLocationUnlocked,
  isLocationComplete,
  getAvailableLocations,
  getLocationProgress,
  awardBadge,
  addJournalEntry,
  getProgressSummary,
  getNextMilestone,
  STAR_EARNING_RULES,
  STAR_MILESTONES,
  BADGES,
  LOCATIONS,
  SCENARIOS_BY_LOCATION
};
