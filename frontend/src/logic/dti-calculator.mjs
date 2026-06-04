/**
 * ProsperCity — Debt-to-Income (DTI) Calculator
 * 
 * Pure ES module for calculating debt-to-income ratios,
 * health scoring (green/yellow/red), loan affordability checking,
 * and interest comparison.
 */

// ─── Constants ───────────────────────────────────────────────────

export const DTI_THRESHOLDS = {
  GREEN_MAX: 36,      // 0-36%: Healthy
  YELLOW_MAX: 43,     // 37-43%: Caution
  // 44%+: Red / Too much debt
};

export const DTI_RATINGS = {
  GREEN: { label: 'Green — Healthy', color: '#2ecc71', emoji: '✅', range: '0–36%' },
  YELLOW: { label: 'Yellow — Caution', color: '#f1c40f', emoji: '⚠️', range: '37–43%' },
  RED: { label: 'Red — Too much debt', color: '#e74c3c', emoji: '🔴', range: '44%+' }
};

// ─── Core DTI Functions ──────────────────────────────────────────

/**
 * Calculate Debt-to-Income ratio.
 * Formula: DTI = (Total Monthly Debt Payments ÷ Monthly Gross Income) × 100
 * 
 * @param {number} monthlyIncome - Gross monthly income
 * @param {Array<{name: string, amount: number}>} debts - Array of monthly debt payments
 * @returns {object} DTI calculation result
 */
export function calculateDTI(monthlyIncome, debts = []) {
  if (typeof monthlyIncome !== 'number' || monthlyIncome <= 0) {
    throw new Error('Monthly income must be a positive number');
  }

  if (!Array.isArray(debts)) {
    throw new Error('Debts must be an array');
  }

  const totalDebt = debts.reduce((sum, debt) => {
    if (typeof debt.amount !== 'number') {
      throw new Error(`Debt amount must be a number for "${debt.name || 'unknown'}"`);
    }
    return sum + debt.amount;
  }, 0);

  const ratio = (totalDebt / monthlyIncome) * 100;
  const roundedRatio = Math.round(ratio * 10) / 10;

  let rating;
  if (roundedRatio <= DTI_THRESHOLDS.GREEN_MAX) {
    rating = 'GREEN';
  } else if (roundedRatio <= DTI_THRESHOLDS.YELLOW_MAX) {
    rating = 'YELLOW';
  } else {
    rating = 'RED';
  }

  const remainingCapacity = monthlyIncome * (DTI_THRESHOLDS.GREEN_MAX / 100) - totalDebt;

  return {
    monthlyIncome,
    totalDebt,
    ratio: roundedRatio,
    rating,
    ratingInfo: DTI_RATINGS[rating],
    remainingCapacity: Math.round(remainingCapacity * 100) / 100,
    debtBreakdown: debts.map(d => ({
      name: d.name || 'Unnamed debt',
      amount: d.amount,
      percentOfIncome: Math.round((d.amount / monthlyIncome) * 100 * 10) / 10
    })),
    isHealthy: rating === 'GREEN',
    isCaution: rating === 'YELLOW',
    isHigh: rating === 'RED'
  };
}

/**
 * Check if a new loan payment would keep DTI in the healthy range.
 * 
 * @param {number} monthlyIncome - Gross monthly income
 * @param {Array<{name: string, amount: number}>} existingDebts - Current monthly debts
 * @param {number} proposedPayment - Proposed new monthly loan payment
 * @returns {object} Affordability assessment
 */
export function checkLoanAffordability(monthlyIncome, existingDebts = [], proposedPayment = 0) {
  const currentDTI = calculateDTI(monthlyIncome, existingDebts);
  const newDebts = [...existingDebts, { name: 'Proposed Loan', amount: proposedPayment }];
  const newDTI = calculateDTI(monthlyIncome, newDebts);

  return {
    currentDTI: currentDTI.ratio,
    currentRating: currentDTI.rating,
    proposedDTI: newDTI.ratio,
    proposedRating: newDTI.rating,
    proposedPayment,
    affordable: newDTI.rating === 'GREEN' || (newDTI.rating === 'YELLOW' && currentDTI.rating === 'GREEN'),
    monthlyPaymentAffordable: newDTI.rating !== 'RED',
    message: newDTI.rating === 'GREEN'
      ? 'This loan looks affordable! Your DTI stays in the green zone.'
      : newDTI.rating === 'YELLOW'
        ? 'Caution: This loan pushes your DTI into the yellow zone. Consider a smaller loan.'
        : 'Warning: This loan would put your DTI in the red zone. Not recommended.'
  };
}

/**
 * Calculate the true cost of credit card debt with minimum payments.
 * 
 * @param {number} balance - Current credit card balance
 * @param {number} apr - Annual Percentage Rate (as percent, e.g. 22.99)
 * @param {number} minPaymentPercent - Minimum payment as % of balance (default: 2%)
 * @param {number} fixedMonthlyPayment - Optional fixed monthly payment (overrides min)
 * @returns {object} Payment projection
 */
export function calculateCreditCardCost(balance, apr, minPaymentPercent = 2, fixedMonthlyPayment = null) {
  if (balance <= 0) throw new Error('Balance must be positive');
  if (apr < 0) throw new Error('APR must be non-negative');

  const monthlyRate = (apr / 100) / 12;
  let remaining = balance;
  let totalPaid = 0;
  let months = 0;
  const MONTHLY_LIMIT = 600; // Safety: max 50 years

  while (remaining > 0.01 && months < MONTHLY_LIMIT) {
    const interest = remaining * monthlyRate;
    let payment;

    if (fixedMonthlyPayment) {
      payment = Math.min(fixedMonthlyPayment, remaining + interest);
    } else {
      payment = Math.max(remaining * (minPaymentPercent / 100), 25); // min $25 or 2%
    }

    payment = Math.min(payment, remaining + interest);
    totalPaid += payment;
    remaining = remaining + interest - payment;
    months++;
  }

  const totalInterest = totalPaid - balance;

  return {
    originalBalance: balance,
    apr,
    monthsToPayOff: months,
    yearsToPayOff: Math.round((months / 12) * 10) / 10,
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    interestPercentOfOriginal: Math.round((totalInterest / balance) * 100 * 10) / 10,
    paymentType: fixedMonthlyPayment ? `$${fixedMonthlyPayment}/mo fixed` : `${minPaymentPercent}% minimum`
  };
}

/**
 * Compare different loan options side by side.
 * 
 * @param {Array<{name: string, principal: number, rate: number, termMonths: number}>} loans
 * @returns {Array} Loan comparison with monthly payment and total cost
 */
export function compareLoans(loans = []) {
  return loans.map(loan => {
    const monthlyRate = (loan.rate / 100) / 12;
    const numPayments = loan.termMonths;

    // Standard amortization formula
    const monthlyPayment = monthlyRate > 0
      ? loan.principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loan.principal / numPayments;

    const totalCost = monthlyPayment * numPayments;
    const totalInterest = totalCost - loan.principal;

    return {
      name: loan.name,
      principal: loan.principal,
      rate: loan.rate,
      termMonths: loan.termMonths,
      termYears: loan.termMonths / 12,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      interestPercentOfPrincipal: Math.round((totalInterest / loan.principal) * 100 * 10) / 10
    };
  });
}

// ─── Scenario Helpers ────────────────────────────────────────────

/**
 * Pre-built DTI scenarios from the game design doc.
 */
export const DTI_SCENARIOS = [
  {
    id: 'alex-college',
    name: 'Alex the College Student',
    income: 1800,
    debts: [
      { name: 'Student Loan', amount: 200 },
      { name: 'Credit Card', amount: 75 },
      { name: 'Car Loan', amount: 150 }
    ],
    correctRatio: 23.6,
    correctRating: 'GREEN'
  },
  {
    id: 'bella-borrower',
    name: 'Bella the Borrower',
    income: 2500,
    debts: [
      { name: 'Student Loan', amount: 250 },
      { name: 'Credit Card Min', amount: 200 },
      { name: 'Personal Loan', amount: 400 },
      { name: 'Car Loan', amount: 350 }
    ],
    correctRatio: 48,
    correctRating: 'RED'
  },
  {
    id: 'carlos-cautious',
    name: 'Carlos the Cautious',
    income: 3200,
    debts: [
      { name: 'Mortgage', amount: 800 },
      { name: 'Car Loan', amount: 0 },
      { name: 'Credit Card', amount: 50 }
    ],
    correctRatio: 26.6,
    correctRating: 'GREEN'
  }
];

/**
 * Get a random DTI scenario for the game.
 * @returns {object} A random scenario
 */
export function getRandomDTIScenario() {
  return DTI_SCENARIOS[Math.floor(Math.random() * DTI_SCENARIOS.length)];
}

export default {
  calculateDTI,
  checkLoanAffordability,
  calculateCreditCardCost,
  compareLoans,
  DTI_THRESHOLDS,
  DTI_RATINGS,
  DTI_SCENARIOS,
  getRandomDTIScenario
