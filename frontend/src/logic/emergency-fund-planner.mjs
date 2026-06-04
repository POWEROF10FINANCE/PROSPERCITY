/**
 * ProsperCity — Emergency Fund Planner
 * 
 * Pure ES module for emergency fund target calculation,
 * contribution timeline projection, and rainy day event simulation.
 */

// ─── Constants ───────────────────────────────────────────────────

export const FUND_TARGETS = {
  MINIMUM: 3,     // 3 months of expenses
  MODERATE: 6,    // 6 months of expenses
  FULL: 12        // 12 months of expenses — fully prepared
};

export const FUND_LEVELS = [
  { months: 1, label: 'Starter Shield', description: '1 month — getting started!' },
  { months: 3, label: 'Basic Shield', description: '3 months — minimum recommended' },
  { months: 6, label: 'Strong Shield', description: '6 months — well prepared' },
  { months: 9, label: 'Reinforced Shield', description: '9 months — very secure' },
  { months: 12, label: 'Fortress', description: '12 months — financial fortress!' }
];

export const EMERGENCY_EVENTS = [
  { id: 'phone-shatter', name: 'Phone Screen Shattered', cost: 150, consequence: 'No phone for 2 weeks', emoji: '📱' },
  { id: 'bike-chain', name: 'Bike Chain Breaks', cost: 80, consequence: 'Can\'t get to school/work', emoji: '🚲' },
  { id: 'urgent-care', name: 'Urgent Care Visit', cost: 250, consequence: 'Medical bill surprise', emoji: '🏥' },
  { id: 'laptop-crash', name: 'Laptop Crashes', cost: 400, consequence: 'Can\'t do homework', emoji: '💻' },
  { id: 'lost-bus-pass', name: 'Lost Bus Pass', cost: 50, consequence: 'Need replacement', emoji: '🚌' },
  { id: 'backpack-stolen', name: 'Backpack Stolen', cost: 200, consequence: 'Replace books & supplies', emoji: '🎒' }
];

// ─── Core Emergency Fund Functions ───────────────────────────────

/**
 * Calculate emergency fund target amounts.
 * 
 * @param {number} monthlyExpenses - Total monthly living expenses
 * @returns {object} Fund targets for 3, 6, and 12 months
 */
export function calculateEmergencyFundTarget(monthlyExpenses) {
  if (typeof monthlyExpenses !== 'number' || monthlyExpenses <= 0) {
    throw new Error('Monthly expenses must be a positive number');
  }

  return {
    monthlyExpenses,
    targets: FUND_LEVELS.map(level => ({
      months: level.months,
      label: level.label,
      description: level.description,
      targetAmount: Math.round(monthlyExpenses * level.months)
    })),
    recommended: {
      minimum: Math.round(monthlyExpenses * FUND_TARGETS.MINIMUM),
      moderate: Math.round(monthlyExpenses * FUND_TARGETS.MODERATE),
      full: Math.round(monthlyExpenses * FUND_TARGETS.FULL)
    }
  };
}

/**
 * Calculate how long it will take to reach an emergency fund goal.
 * 
 * @param {number} targetAmount - Fund target amount
 * @param {number} currentAmount - Already saved
 * @param {number} monthlyContribution - Amount saved per month
 * @returns {object} Timeline
 */
export function calculateFundTimeline(targetAmount, currentAmount = 0, monthlyContribution = 0) {
  if (targetAmount <= 0) throw new Error('Target amount must be positive');

  const remaining = Math.max(0, targetAmount - currentAmount);

  if (monthlyContribution <= 0) {
    return {
      targetAmount,
      currentAmount,
      monthlyContribution: 0,
      remaining,
      monthsToGoal: Infinity,
      yearsToGoal: Infinity,
      progressPercent: currentAmount > 0 ? Math.min(100, Math.round((currentAmount / targetAmount) * 100)) : 0,
      achievable: false
    };
  }

  const monthsToGoal = Math.ceil(remaining / monthlyContribution);

  return {
    targetAmount,
    currentAmount,
    monthlyContribution,
    remaining,
    monthsToGoal,
    yearsToGoal: Math.round((monthsToGoal / 12) * 10) / 10,
    progressPercent: Math.min(100, Math.round((currentAmount / targetAmount) * 100)),
    achievable: monthsToGoal < 1200
  };
}

/**
 * Calculate how much needs to be saved monthly to hit a target by a deadline.
 * 
 * @param {number} targetAmount - Fund target
 * @param {number} currentAmount - Already saved
 * @param {number} monthsDeadline - Months until deadline
 * @returns {object} Required monthly contribution
 */
export function calculateRequiredMonthlyContribution(targetAmount, currentAmount = 0, monthsDeadline = 12) {
  if (monthsDeadline <= 0) throw new Error('Deadline months must be positive');
  const remaining = Math.max(0, targetAmount - currentAmount);
  const monthlyNeeded = remaining / monthsDeadline;

  return {
    targetAmount,
    currentAmount,
    monthsDeadline,
    remaining,
    monthlyRequired: Math.round(monthlyNeeded * 100) / 100
  };
}

/**
 * Get a recommended fund level based on player profile.
 * 
 * @param {number} monthlyExpenses 
 * @param {string} stability - 'stable' | 'moderate' | 'unstable'
 * @returns {object} Recommendation
 */
export function getRecommendedFundLevel(monthlyExpenses, stability = 'moderate') {
  const targets = calculateEmergencyFundTarget(monthlyExpenses);

  let recommendedMonths;
  let reasoning;

  switch (stability) {
    case 'stable':
      recommendedMonths = 3;
      reasoning = 'With a stable income, 3 months of expenses is a solid safety net.';
      break;
    case 'moderate':
      recommendedMonths = 6;
      reasoning = 'With moderate stability, 6 months gives you breathing room.';
      break;
    case 'unstable':
      recommendedMonths = 12;
      reasoning = 'With variable income, aim for 12 months — maximum protection.';
      break;
    default:
      recommendedMonths = 6;
      reasoning = '6 months of expenses is a great all-purpose target.';
  }

  const level = FUND_LEVELS.find(l => l.months === recommendedMonths) || FUND_LEVELS[2];

  return {
    monthlyExpenses,
    recommendedMonths,
    recommendedAmount: Math.round(monthlyExpenses * recommendedMonths),
    levelName: level.label,
    levelDescription: level.description,
    reasoning,
    targets: targets.targets,
    shieldStrength: recommendedMonths >= 12 ? 'fortress' : recommendedMonths >= 6 ? 'strong' : recommendedMonths >= 3 ? 'basic' : 'starter'
  };
}

// ─── Emergency Event Simulation ──────────────────────────────────

/**
 * Pick a random emergency event for the Rainy Day Simulator.
 * @returns {object} Random emergency event
 */
export function getRandomEmergencyEvent() {
  return EMERGENCY_EVENTS[Math.floor(Math.random() * EMERGENCY_EVENTS.length)];
}

/**
 * Simulate the outcome of a financial emergency decision.
 * 
 * @param {object} event - The emergency event
 * @param {number} currentFund - Current emergency fund balance
 * @param {string} decision - 'pay-from-fund' | 'credit-card' | 'borrow'
 * @returns {object} Simulation result
 */
export function simulateEmergencyDecision(event, currentFund, decision) {
  if (!event || !event.cost) throw new Error('Invalid emergency event');

  let outcome;
  let newFund = currentFund;
  let message;

  switch (decision) {
    case 'pay-from-fund':
      if (currentFund >= event.cost) {
        newFund = currentFund - event.cost;
        outcome = 'success';
        message = `✅ Paid $${event.cost} from emergency fund. That's what it's for! Remaining: $${newFund}`;
      } else {
        newFund = 0;
        outcome = 'shortfall';
        message = `⚠️ Your fund had $${currentFund} but the emergency cost $${event.cost}. You'll need to find $${event.cost - currentFund} elsewhere.`;
      }
      break;

    case 'credit-card':
      // Credit card with 22% APR
      const monthlyRate = 0.22 / 12;
      let ccBalance = event.cost;
      let ccTotalPaid = 0;
      let ccMonths = 0;
      // Simulate minimum payments over time
      while (ccBalance > 0.01 && ccMonths < 60) {
        const interest = ccBalance * monthlyRate;
        const payment = Math.max(ccBalance * 0.02, 25);
        ccBalance = ccBalance + interest - payment;
        ccTotalPaid += payment;
        ccMonths++;
      }
      outcome = 'debt-trap';
      message = `💳 Charged $${event.cost} to credit card. With 22% APR and minimum payments, it will take ${ccMonths} months and cost ~$${Math.round(ccTotalPaid)} total.`;
      break;

    case 'borrow':
      outcome = 'social-cost';
      message = `🙏 Asked family/friends for $${event.cost}. They helped, but it's good to have your own fund next time.`;
      break;

    default:
      throw new Error(`Unknown decision: ${decision}`);
  }

  return {
    event,
    decision,
    cost: event.cost,
    fundBefore: currentFund,
    fundAfter: newFund,
    fundDrawn: currentFund - newFund,
    outcome,
    message,
    isFundDepleted: newFund <= 0
  };
}

/**
 * Sort events into true emergencies vs impulse wants.
 * @param {Array<{name: string, isEmergency: boolean}>} items 
 * @returns {object} Sorted result
 */
export function classifyEmergency(items = []) {
  const correct = items.filter(i => i.isEmergency === true).length;
  const incorrect = items.filter(i => i.isEmergency === false).length;

  return {
    total: items.length,
    correct,
    incorrect,
    score: Math.round((correct / items.length) * 100),
    items: items.map(item => ({
      ...item,
      isEmergency: Boolean(item.isEmergency)
    }))
  };
}

export default {
  calculateEmergencyFundTarget,
  calculateFundTimeline,
  calculateRequiredMonthlyContribution,
  getRecommendedFundLevel,
  getRandomEmergencyEvent,
  simulateEmergencyDecision,
  classifyEmergency,
  FUND_TARGETS,
  FUND_LEVELS,
  EMERGENCY_EVENTS
