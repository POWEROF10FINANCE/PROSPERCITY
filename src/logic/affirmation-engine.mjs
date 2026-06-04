/**
 * ProsperCity — Affirmation Engine
 * 
 * Pure ES module for managing financial confidence affirmations.
 * Picks context-appropriate affirmations based on the player's
 * current scenario, struggle level, and tracks recently shown ones.
 */

// ─── Master Affirmation List ──────────────────────────────────────
// (From game design: design/03_AFFIRMATIONS.md)

export const AFFIRMATIONS = {
  'home-base': [
    { id: 'hb-1', text: 'Every budget is a plan for your dreams. You\'re already off to a great start!', tags: ['budgeting', 'encouragement'] },
    { id: 'hb-2', text: 'Knowing what you earn is the first step to owning your future.', tags: ['income', 'awareness'] },
    { id: 'hb-3', text: 'Knowing the difference between needs and wants is a superpower.', tags: ['needs-wants', 'categorization'] },
    { id: 'hb-4', text: 'A balanced budget is a balanced life. You\'re building good habits!', tags: ['budgeting', 'balance'] },
    { id: 'hb-5', text: 'You don\'t need a million dollars to be good with money — you just need a plan.', tags: ['mindset', 'planning'] },
    { id: 'hb-6', text: 'Saving isn\'t about what you give up — it\'s about what you gain later.', tags: ['saving', 'mindset'] },
    { id: 'hb-7', text: 'Tracking your spending is like looking at a map. You can\'t get where you\'re going without one.', tags: ['tracking', 'awareness'] },
    { id: 'hb-8', text: 'Small savings add up to big things. Every dollar counts!', tags: ['saving', 'compounding'] },
    { id: 'hb-9', text: 'Your income is your engine. Your budget is the steering wheel.', tags: ['budgeting', 'analogy'] }
  ],
  'the-bank': [
    { id: 'bk-1', text: 'Borrowing isn\'t bad — it\'s about knowing the rules. You\'ve got this!', tags: ['debt', 'mindset'] },
    { id: 'bk-2', text: 'Not all debt is created equal. Smart borrowing is a tool, not a trap.', tags: ['debt', 'good-debt'] },
    { id: 'bk-3', text: 'Your DTI is like a health bar in a video game — keep it in the green!', tags: ['dti', 'analogy'] },
    { id: 'bk-4', text: 'Interest can work for you (savings) or against you (debt). You choose the direction.', tags: ['interest', 'choice'] },
    { id: 'bk-5', text: 'A credit card is a tool, not free money. You\'re too smart to fall for that trap!', tags: ['credit', 'awareness'] },
    { id: 'bk-6', text: 'Your credit score isn\'t a grade — it\'s a story. Write a good one.', tags: ['credit', 'mindset'] },
    { id: 'bk-7', text: 'Paying off debt feels better than buying anything. Trust me!', tags: ['debt', 'motivation'] }
  ],
  'travel-agency': [
    { id: 'tr-1', text: 'Planning ahead means more fun later. You\'re a travel pro!', tags: ['planning', 'vacation'] },
    { id: 'tr-2', text: 'Good planning means good travels. You\'re building skills that will take you places!', tags: ['planning', 'growth'] },
    { id: 'tr-3', text: 'The best travelers expect the unexpected. Great attention to detail!', tags: ['hidden-costs', 'preparation'] },
    { id: 'tr-4', text: 'A goal without a plan is just a wish. You\'re making real plans!', tags: ['goal-setting', 'planning'] },
    { id: 'tr-5', text: 'Every trip starts with a single step — and a solid budget!', tags: ['budgeting', 'vacation'] },
    { id: 'tr-6', text: 'Comparing prices isn\'t cheap — it\'s smart. Well done!', tags: ['comparison', 'smart-spending'] }
  ],
  'emergency-hq': [
    { id: 'em-1', text: 'Emergencies happen — but you\'re building a shield. Strong work!', tags: ['emergency', 'preparation'] },
    { id: 'em-2', text: 'An emergency fund isn\'t \'extra money\' — it\'s peace of mind in a bank account.', tags: ['emergency', 'mindset'] },
    { id: 'em-3', text: 'Emergencies aren\'t failures — they\'re tests of your preparation. And you\'re prepared!', tags: ['emergency', 'resilience'] },
    { id: 'em-4', text: 'The best time to build an emergency fund was yesterday. The second best time is now.', tags: ['emergency', 'motivation'] },
    { id: 'em-5', text: 'You can\'t predict the future, but you can prepare for it. That\'s real power.', tags: ['preparation', 'empowerment'] },
    { id: 'em-6', text: 'Your emergency fund is your \'I got this\' button.', tags: ['emergency', 'confidence'] }
  ],
  'confidence-corner': [
    { id: 'cc-1', text: 'You don\'t need to be a math genius — you just need to start.', tags: ['mindset', 'beginner'] },
    { id: 'cc-2', text: 'Every financial mistake is just a lesson in disguise.', tags: ['mistakes', 'growth'] },
    { id: 'cc-3', text: 'Your future self will thank you for what you learn today.', tags: ['future', 'motivation'] },
    { id: 'cc-4', text: 'Being good with money isn\'t about being perfect — it\'s about trying.', tags: ['effort', 'mindset'] },
    { id: 'cc-5', text: 'Confidence comes from practice. You\'re practicing right now!', tags: ['confidence', 'practice'] },
    { id: 'cc-6', text: 'Money is a tool, not a goal. The goal is the life you want to live.', tags: ['mindset', 'perspective'] },
    { id: 'cc-7', text: 'You are not your bank balance. Your worth is not your wallet.', tags: ['self-worth', 'mindset'] },
    { id: 'cc-8', text: 'Every expert was once a beginner. You\'re on your way!', tags: ['growth', 'encouragement'] },
    { id: 'cc-9', text: 'It\'s okay to not know. It\'s not okay to not learn. And you\'re learning!', tags: ['learning', 'encouragement'] }
  ],
  'investment-island': [
    { id: 'in-1', text: 'Growing money takes time, like planting a tree. You\'re building a forest!', tags: ['investing', 'patience'] },
    { id: 'in-2', text: 'Investing means your money works for YOU — even while you sleep!', tags: ['investing', 'passive-income'] },
    { id: 'in-3', text: 'Compound interest is the eighth wonder of the world. You\'re about to understand why.', tags: ['compounding', 'investing'] },
    { id: 'in-4', text: 'Time in the market beats timing the market. Stay patient!', tags: ['investing', 'long-term'] },
    { id: 'in-5', text: 'Don\'t put all your eggs (or coconuts) in one basket. Diversify!', tags: ['diversification', 'investing'] }
  ]
};

// ─── Flat list of all affirmations ───────────────────────────────

export const ALL_AFFIRMATIONS = Object.values(AFFIRMATIONS).flat();

// ─── Journal Prompts ──────────────────────────────────────────────

export const JOURNAL_PROMPTS = [
  'One money goal I have today is...',
  'Something I learned about money recently is...',
  'A financial decision I\'m proud of is...',
  'One thing I want to understand better about money is...',
  'If I had $100 right now, I would...'
];

// ─── Affirmation Selector Engine ─────────────────────────────────

/**
 * Get a random affirmation for a specific location.
 * Avoids repeating recently shown affirmations.
 * 
 * @param {string} locationId - Location key (e.g., 'home-base', 'the-bank')
 * @param {Array<string>} recentIds - Array of recently shown affirmation IDs to avoid
 * @returns {object} Selected affirmation
 */
export function getAffirmationForLocation(locationId, recentIds = []) {
  const pool = AFFIRMATIONS[locationId];
  if (!pool || pool.length === 0) {
    // Fallback to any affirmation
    return getRandomAffirmation(recentIds);
  }

  // Filter out recently shown ones
  const available = pool.filter(a => !recentIds.includes(a.id));

  // If all have been shown recently, reset the pool
  const selectionPool = available.length > 0 ? available : pool;

  const selected = selectionPool[Math.floor(Math.random() * selectionPool.length)];

  return {
    ...selected,
    locationId
  };
}

/**
 * Get a completely random affirmation from any location.
 * 
 * @param {Array<string>} recentIds - IDs to avoid
 * @returns {object} Random affirmation with location info
 */
export function getRandomAffirmation(recentIds = []) {
  const allItems = ALL_AFFIRMATIONS.filter(a => !recentIds.includes(a.id));
  const pool = allItems.length > 0 ? allItems : ALL_AFFIRMATIONS;

  const selected = pool[Math.floor(Math.random() * pool.length)];

  // Find which location it belongs to
  let locationId = null;
  for (const [loc, affirms] of Object.entries(AFFIRMATIONS)) {
    if (affirms.some(a => a.id === selected.id)) {
      locationId = loc;
      break;
    }
  }

  return {
    ...selected,
    locationId
  };
}

/**
 * Get affirmations tagged with a specific topic.
 * 
 * @param {string} tag - Tag to filter by (e.g., 'debt', 'saving', 'mindset')
 * @returns {Array} Affirmations with matching tag
 */
export function getAffirmationsByTag(tag) {
  return ALL_AFFIRMATIONS.filter(a => a.tags.includes(tag));
}

/**
 * Get a contextual affirmation based on scenario difficulty or player struggle.
 * 
 * @param {string} locationId - Current location
 * @param {string} struggle - 'struggling' | 'neutral' | 'excelling'
 * @param {Array<string>} recentIds - Recently shown affirmations
 * @returns {object} Selected affirmation with encouragement level
 */
export function getContextualAffirmation(locationId, struggle = 'neutral', recentIds = []) {
  const base = getAffirmationForLocation(locationId, recentIds);

  // If struggling, add an extra encouragement note
  if (struggle === 'struggling') {
    return {
      ...base,
      contextNote: 'It\'s okay to find this tricky — every try makes you stronger!',
      encouragementLevel: 'extra'
    };
  }

  if (struggle === 'excelling') {
    return {
      ...base,
      contextNote: 'You\'re a natural! Keep that momentum going!',
      encouragementLevel: 'high'
    };
  }

  return {
    ...base,
    contextNote: null,
    encouragementLevel: 'normal'
  };
}

/**
 * Get a random journal prompt.
 * @returns {string} Journal prompt
 */
export function getRandomJournalPrompt() {
  return JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
}

/**
 * Get a daily affirmation (changes each day based on date).
 * @param {string} locationId - Optional location filter
 * @returns {object} Daily affirmation
 */
export function getDailyAffirmation(locationId = null) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const dateHash = dateStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  let pool;
  if (locationId && AFFIRMATIONS[locationId]) {
    pool = AFFIRMATIONS[locationId];
  } else {
    pool = ALL_AFFIRMATIONS;
  }

  const index = dateHash % pool.length;
  const selected = pool[index];

  let locId = locationId;
  if (!locId) {
    for (const [loc, affirms] of Object.entries(AFFIRMATIONS)) {
      if (affirms.some(a => a.id === selected.id)) {
        locId = loc;
        break;
      }
    }
  }

  return {
    ...selected,
    locationId: locId,
    isDaily: true,
    date: dateStr
  };
}

export default {
  AFFIRMATIONS,
  ALL_AFFIRMATIONS,
  JOURNAL_PROMPTS,
  getAffirmationForLocation,
  getRandomAffirmation,
  getAffirmationsByTag,
  getContextualAffirmation,
  getRandomJournalPrompt,
  getDailyAffirmation
