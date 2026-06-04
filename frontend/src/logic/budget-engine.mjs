/**
 * ProsperCity — Budget Engine
 * 
 * Pure ES module for budget calculations.
 * Supports the 50/30/20 rule, surplus/deficit analysis,
 * savings rate calculation, and savings goal projection.
 */

// ─── Constants ───────────────────────────────────────────────────

export const BUDGET_RULES = {
  FIFTY_THIRTY_TWENTY: {
    needs: 0.50,
    wants: 0.30,
    savings: 0.20,
    label: '50/30/20 Rule',
    description: '50% Needs, 30% Wants, 20% Savings'
  },
  SIXTY_THIRTY_TEN: {
    needs: 0.60,
    wants: 0.30,
    savings: 0.10,
    label: '60/30/10 Rule',
    description: '60% Needs, 30% Wants, 10% Savings (for tight budgets)'
  },
  SEVENTY_TWENTY_TEN: {
    needs: 0.70,
    wants: 0.20,
    savings: 0.10,
    label: '70/20/10 Rule',
    description: '70% Needs, 20% Wants, 10% Savings (bare essentials)'
  }
};

// ─── Core Budget Functions ───────────────────────────────────────

/**
 * Calculate a full budget breakdown.
 * @param {number} income - Monthly income (after tax)
 * @param {Array<{category: string, name: string, amount: number}>} expenses
 * @param {number} savingsGoal - Target savings per month
 * @param {string} rule - Key from BUDGET_RULES (default: FIFTY_THIRTY_TWENTY)
 * @returns {object} Budget breakdown
 */
export function calculateBudget(income, expenses = [], savingsGoal = 0, rule = 'FIFTY_THIRTY_TWENTY') {
  if (typeof income !== 'number' || income < 0) {
    throw new Error('Income must be a non-negative number');
  }

  const ruleConfig = BUDGET_RULES[rule] || BUDGET_RULES.FIFTY_THIRTY_TWENTY;

  // Categorize expenses
  const needsExpenses = expenses.filter(e => e.category === 'needs');
  const wantsExpenses = expenses.filter(e => e.category === 'wants');
  const savingsExpenses = expenses.filter(e => e.category === 'savings');

  const totalNeeds = needsExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalWants = wantsExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = savingsExpenses.reduce((sum, e) => sum + e.amount, 0) + savingsGoal;
  const totalExpenses = totalNeeds + totalWants + (savingsExpenses.reduce((sum, e) => sum + e.amount, 0));

  const surplus = income - totalExpenses - savingsGoal;
  const deficit = surplus < 0 ? Math.abs(surplus) : 0;

  // Target allocations based on chosen rule
  const targetNeeds = income * ruleConfig.needs;
  const targetWants = income * ruleConfig.wants;
  const targetSavings = income * ruleConfig.savings;

  // Savings rate (as percentage of income)
  const savingsRate = income > 0 ? ((totalSavings / income) * 100) : 0;

  // Category breakdown as percentages
  const needsPercent = income > 0 ? (totalNeeds / income) * 100 : 0;
  const wantsPercent = income > 0 ? (totalWants / income) * 100 : 0;
  const savingsPercent = income > 0 ? (totalSavings / income) * 100 : 0;

  return {
    income,
    totalExpenses,
    totalNeeds,
    totalWants,
    totalSavings,
    savingsGoal,
    surplus,
    deficit,
    surplusOrDeficit: surplus >= 0 ? 'surplus' : 'deficit',
    savingsRate: Math.round(savingsRate * 10) / 10,
    breakdown: [
      { category: 'needs', amount: totalNeeds, percent: Math.round(needsPercent * 10) / 10, target: targetNeeds, onTrack: totalNeeds <= targetNeeds + income * 0.05 },
      { category: 'wants', amount: totalWants, percent: Math.round(wantsPercent * 10) / 10, target: targetWants, onTrack: totalWants <= targetWants + income * 0.05 },
      { category: 'savings', amount: totalSavings, percent: Math.round(savingsPercent * 10) / 10, target: targetSavings, onTrack: totalSavings >= targetSavings * 0.75 }
    ],
    ruleApplied: ruleConfig,
    healthScore: calculateBudgetHealth(savingsRate, surplus, totalExpenses, income)
  };
}

/**
 * Calculate a budget health score (0-100).
 * @returns {number} Score 0-100
 */
function calculateBudgetHealth(savingsRate, surplus, totalExpenses, income) {
  let score = 50; // start neutral

  // Savings rate contribution (up to +30 points)
  if (savingsRate >= 20) score += 30;
  else if (savingsRate >= 15) score += 20;
  else if (savingsRate >= 10) score += 15;
  else if (savingsRate >= 5) score += 5;
  else score -= 10;

  // Surplus contribution (up to +20 points)
  if (surplus > 0) {
    const surplusRatio = surplus / income;
    if (surplusRatio >= 0.1) score += 20;
    else if (surplusRatio >= 0.05) score += 10;
    else score += 5;
  } else {
    const deficitRatio = Math.abs(surplus) / income;
    if (deficitRatio >= 0.2) score -= 25;
    else if (deficitRatio >= 0.1) score -= 15;
    else score -= 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Get a health rating label from a score.
 * @param {number} score - 0-100 budget health score
 * @returns {string} 'excellent' | 'good' | 'fair' | 'needs-attention' | 'critical'
 */
export function getHealthRating(score) {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  if (score >= 20) return 'needs-attention';
  return 'critical';
}

// ─── Savings Goal Tracker ────────────────────────────────────────

/**
 * Calculate savings goal timeline.
 * @param {number} targetAmount - How much you want to save
 * @param {number} currentAmount - What you've saved so far
 * @param {number} monthlyContribution - How much you save per month
 * @returns {object} Timeline breakdown
 */
export function calculateSavingsGoal(targetAmount, currentAmount = 0, monthlyContribution = 0) {
  if (targetAmount <= 0) throw new Error('Target amount must be positive');
  if (monthlyContribution <= 0) {
    return {
      targetAmount,
      currentAmount,
      monthlyContribution: 0,
      remaining: targetAmount - currentAmount,
      monthsToGoal: Infinity,
      yearsToGoal: Infinity,
      progressPercent: Math.min(100, (currentAmount / targetAmount) * 100),
      achievable: false
    };
  }

  const remaining = Math.max(0, targetAmount - currentAmount);
  const monthsToGoal = Math.ceil(remaining / monthlyContribution);
  const yearsToGoal = monthsToGoal / 12;

  return {
    targetAmount,
    currentAmount,
    monthlyContribution,
    remaining,
    monthsToGoal,
    yearsToGoal: Math.round(yearsToGoal * 10) / 10,
    progressPercent: Math.min(100, Math.round((currentAmount / targetAmount) * 100 * 10) / 10),
    achievable: monthsToGoal < 1200 // 100 years max
  };
}

/**
 * Calculate how much to save per month to reach a goal in a given timeframe.
 * @param {number} targetAmount - Savings target
 * @param {number} currentAmount - Already saved
 * @param {number} months - Desired months to reach goal
 * @returns {object} Required monthly contribution
 */
export function calculateRequiredMonthly(targetAmount, currentAmount = 0, months = 12) {
  if (months <= 0) throw new Error('Months must be positive');
  const remaining = Math.max(0, targetAmount - currentAmount);
  const monthlyNeeded = remaining / months;

  return {
    targetAmount,
    currentAmount,
    monthsToGoal: months,
    monthlyRequired: Math.round(monthlyNeeded * 100) / 100,
    totalToSave: remaining
  };
}

// ─── 50/30/20 Rule Verifier ──────────────────────────────────────

/**
 * Verify if an allocation follows the 50/30/20 rule within tolerance.
 * @param {number} income 
 * @param {number} needsAmount 
 * @param {number} wantsAmount 
 * @param {number} savingsAmount 
 * @param {number} tolerance - Acceptable deviation (default: 5%)
 * @returns {object} Verification result
 */
export function verifyFiftyThirtyTwenty(income, needsAmount, wantsAmount, savingsAmount, tolerance = 0.05) {
  const total = needsAmount + wantsAmount + savingsAmount;

  const needsTarget = income * 0.50;
  const wantsTarget = income * 0.30;
  const savingsTarget = income * 0.20;

  const needsDeviation = Math.abs(needsAmount - needsTarget) / income;
  const wantsDeviation = Math.abs(wantsAmount - wantsTarget) / income;
  const savingsDeviation = Math.abs(savingsAmount - savingsTarget) / income;

  const needsCorrect = needsDeviation <= tolerance;
  const wantsCorrect = wantsDeviation <= tolerance;
  const savingsCorrect = savingsDeviation <= tolerance;

  const totalMatches = [needsCorrect, wantsCorrect, savingsCorrect].filter(Boolean).length;

  let stars = 0;
  if (totalMatches === 3) stars = 3;
  else if (totalMatches >= 2) stars = 2;
  else if (totalMatches >= 1) stars = 1;

  return {
    income,
    allocated: { needs: needsAmount, wants: wantsAmount, savings: savingsAmount },
    targets: { needs: needsTarget, wants: wantsTarget, savings: savingsTarget },
    deviations: {
      needs: Math.round(needsDeviation * 100 * 10) / 10,
      wants: Math.round(wantsDeviation * 100 * 10) / 10,
      savings: Math.round(savingsDeviation * 100 * 10) / 10
    },
    correctCategories: { needs: needsCorrect, wants: wantsCorrect, savings: savingsCorrect },
    stars,
    totalSumMatches: Math.abs(total - income) < 1,
    tolerance
  };
}

export default {
  calculateBudget,
  calculateSavingsGoal,
  calculateRequiredMonthly,
  verifyFiftyThirtyTwenty,
  getHealthRating,
  BUDGET_RULES
};
