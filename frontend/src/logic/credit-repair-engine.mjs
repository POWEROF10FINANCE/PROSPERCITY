/**
 * ProsperCity — Credit Repair Engine
 *
 * Credit health assessment, dispute letter generation,
 * dispute tracking, and score projection.
 */

// ─── Constants ───────────────────────────────────────────────────

export const CREDIT_SCORE_RANGES = {
  POOR: { min: 300, max: 579, label: 'Poor', color: '#e74c3c', recommendation: 'Focus on paying bills on time and reducing debt.' },
  FAIR: { min: 580, max: 669, label: 'Fair', color: '#f39c12', recommendation: 'Building positive payment history will help.' },
  GOOD: { min: 670, max: 739, label: 'Good', color: '#2ecc71', recommendation: 'Good score! Maintain on-time payments.' },
  VERY_GOOD: { min: 740, max: 799, label: 'Very Good', color: '#27ae60', recommendation: 'Excellent score. You likely qualify for best rates.' },
  EXCELLENT: { min: 800, max: 850, label: 'Excellent', color: '#1abc9c', recommendation: 'Premium credit — keep doing what you\'re doing!' }
};

export const NEGATIVE_ITEM_TYPES = {
  LATE_PAYMENT: { label: 'Late Payment', severity: 3, impact: 'moderate', removalTime: '7 years' },
  COLLECTION: { label: 'Collection Account', severity: 5, impact: 'high', removalTime: '7 years' },
  CHARGE_OFF: { label: 'Charge-Off', severity: 5, impact: 'high', removalTime: '7 years' },
  BANKRUPTCY: { label: 'Bankruptcy', severity: 8, impact: 'severe', removalTime: '10 years' },
  FORECLOSURE: { label: 'Foreclosure', severity: 6, impact: 'high', removalTime: '7 years' },
  TAX_LIEN: { label: 'Tax Lien', severity: 4, impact: 'moderate', removalTime: '7 years' },
  JUDGMENT: { label: 'Judgment', severity: 5, impact: 'high', removalTime: '7 years' },
  HARD_INQUIRY: { label: 'Hard Inquiry', severity: 1, impact: 'minor', removalTime: '2 years' },
  DEFAULT: { label: 'Default', severity: 4, impact: 'moderate', removalTime: '7 years' }
};

export const DISPUTE_STATUSES = {
  DRAFT: 'draft',
  SENT: 'sent',
  RECEIVED: 'received_by_creditor',
  UNDER_REVIEW: 'under_review',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  DISPUTED: 'disputed_with_bureau',
  CLOSED: 'closed'
};

// ─── Credit Health Assessment ────────────────────────────────────

/**
 * Assess credit health and provide recommendations.
 *
 * @param {number} score - Credit score (300-850)
 * @param {Array<{type: string, date: string, amount?: number}>} negativeItems
 * @returns {object} Assessment with score range, recommendations, and impact analysis
 */
export function assessCreditHealth(score, negativeItems = []) {
  if (typeof score !== 'number' || score < 300 || score > 850) {
    throw new Error('Credit score must be a number between 300 and 850');
  }

  // Determine score range
  let range = null;
  for (const [key, r] of Object.entries(CREDIT_SCORE_RANGES)) {
    if (score >= r.min && score <= r.max) {
      range = { key, ...r };
      break;
    }
  }

  if (!range) {
    range = { key: 'POOR', ...CREDIT_SCORE_RANGES.POOR };
  }

  // Analyze negative items
  const itemAnalysis = (negativeItems || []).map(item => {
    const typeInfo = NEGATIVE_ITEM_TYPES[item.type] || NEGATIVE_ITEM_TYPES.DEFAULT;
    return {
      type: item.type,
      label: typeInfo.label,
      severity: typeInfo.severity,
      impact: typeInfo.impact,
      removalTime: typeInfo.removalTime,
      date: item.date,
      amount: item.amount || null,
      estimatedPointsLost: typeInfo.severity * 15,
      disputable: ['LATE_PAYMENT', 'COLLECTION', 'CHARGE_OFF', 'DEFAULT'].includes(item.type)
    };
  });

  // Generate recommendations
  const recommendations = generateRecommendations(score, range, negativeItems);

  // Estimate points recoverable through repair
  const totalPointsLost = itemAnalysis.reduce((sum, item) => sum + item.estimatedPointsLost, 0);
  const recoverablePoints = Math.min(totalPointsLost * 0.7, 850 - score);

  return {
    score,
    range: range.key,
    rangeLabel: range.label,
    rangeColor: range.color,
    assessment: range.recommendation,
    negativeItems: itemAnalysis,
    totalNegativeItems: negativeItems?.length || 0,
    totalEstimatedPointsLost: totalPointsLost,
    estimatedRecoverablePoints: Math.round(recoverablePoints),
    projectedScoreAfterRepair: Math.min(850, Math.round(score + recoverablePoints)),
    canDispute: itemAnalysis.some(i => i.disputable),
    recommendations,
    healthScore: calculateCreditHealthScore(score, negativeItems)
  };
}

/**
 * Generate actionable credit improvement recommendations.
 */
function generateRecommendations(score, range, negativeItems) {
  const recs = [];

  if (score < 580) {
    recs.push({ priority: 'critical', action: 'Pay all bills on time going forward', impact: 'Builds positive payment history', timeline: '3-6 months' });
    recs.push({ priority: 'critical', action: 'Pay down credit card balances below 30% utilization', impact: 'Improves credit utilization ratio', timeline: '1-3 months' });
  }

  if (score < 670) {
    recs.push({ priority: 'high', action: 'Dispute any inaccurate negative items on your credit report', impact: 'Can remove incorrect marks', timeline: '30-60 days' });
    recs.push({ priority: 'high', action: 'Become an authorized user on a family member\'s good credit card', impact: 'Benefits from their positive history', timeline: '1-2 months' });
  }

  if (score < 740) {
    recs.push({ priority: 'medium', action: 'Keep old credit accounts open to maintain credit history length', impact: 'Lengthens average account age', timeline: 'Ongoing' });
    recs.push({ priority: 'medium', action: 'Limit new credit applications to avoid hard inquiries', impact: 'Reduces inquiry impact', timeline: '6-12 months' });
  }

  // Specific recommendations based on negative items
  if (negativeItems && negativeItems.length > 0) {
    const hasLatePayment = negativeItems.some(i => i.type === 'LATE_PAYMENT');
    const hasCollection = negativeItems.some(i => i.type === 'COLLECTION');

    if (hasLatePayment) {
      recs.push({ priority: 'high', action: 'Set up autopay for all accounts to prevent future late payments', impact: 'Prevents new negative marks', timeline: 'Immediate' });
    }
    if (hasCollection) {
      recs.push({ priority: 'high', action: 'Negotiate a pay-for-delete agreement with collection agencies', impact: 'Removal in exchange for payment', timeline: '30-90 days' });
    }
  }

  recs.push({ priority: 'low', action: 'Check your credit report annually at AnnualCreditReport.com', impact: 'Stay informed and catch errors early', timeline: 'Yearly' });

  return recs;
}

/**
 * Calculate a composite credit health score (0-100).
 */
function calculateCreditHealthScore(score, negativeItems) {
  let health = 50;

  // Score contribution (0-40 points)
  if (score >= 800) health += 40;
  else if (score >= 740) health += 30;
  else if (score >= 670) health += 20;
  else if (score >= 580) health += 10;
  else health -= 10;

  // Negative items penalty (0 to -30 points)
  const penalty = (negativeItems || []).reduce((sum, item) => {
    const typeInfo = NEGATIVE_ITEM_TYPES[item.type];
    return sum + (typeInfo ? typeInfo.severity * 2 : 2);
  }, 0);
  health -= Math.min(penalty, 30);

  return Math.max(0, Math.min(100, health));
}

// ─── Dispute Letter Templates ────────────────────────────────────

/**
 * Get all available dispute letter templates.
 * @returns {Array<{id: string, name: string, description: string}>}
 */
export function getDisputeTemplates() {
  return [
    { id: 'incorrect-balance', name: 'Incorrect Balance', description: 'The reported balance on this account is wrong.' },
    { id: 'not-my-account', name: 'Not My Account', description: 'This account does not belong to me.' },
    { id: 'paid-in-full', name: 'Paid in Full', description: 'This account was paid in full but still shows a balance.' },
    { id: 'outdated-info', name: 'Outdated Information', description: 'This negative item is past the 7-year reporting period.' },
    { id: 'identity-theft', name: 'Identity Theft', description: 'This account was opened fraudulently.' },
    { id: 'incorrect-late-payment', name: 'Incorrect Late Payment', description: 'I made this payment on time.' }
  ];
}

/**
 * Generate a formal dispute letter based on template.
 *
 * @param {string} templateId - Template identifier
 * @param {object} params - Letter parameters
 * @param {string} params.creditorName - Name of the creditor/collection agency
 * @param {string} params.accountNumber - Account number being disputed
 * @param {string} params.reason - Specific reason for dispute
 * @param {object} params.userInfo - { fullName, address, city, state, zip, phone, email }
 * @returns {object} Generated letter content
 */
export function generateDisputeLetter(templateId, params = {}) {
  const { creditorName, accountNumber, reason, userInfo } = params;

  if (!creditorName) throw new Error('creditorName is required');
  if (!userInfo?.fullName) throw new Error('userInfo.fullName is required');

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const userAddress = [
    userInfo.fullName,
    userInfo.address,
    `${userInfo.city}, ${userInfo.state} ${userInfo.zip}`
  ].filter(Boolean).join('\n');

  const template = getTemplateContent(templateId, { creditorName, accountNumber, reason, userInfo });

  const letter = `${dateStr}

${creditorName}
Credit Dispute Department
${userInfo.address ? '' : '[Creditor Address]'}

RE: Dispute of Account #${accountNumber || '[Account Number]'}

To Whom It May Concern:

${template.body}

Sincerely,

${userAddress}
${userInfo.phone ? `Phone: ${userInfo.phone}` : ''}
${userInfo.email ? `Email: ${userInfo.email}` : ''}

---
CERTIFIED MAIL RETURN RECEIPT REQUESTED #__________
`;

  return {
    templateId,
    templateName: template.name,
    creditorName,
    accountNumber: accountNumber || '[Account Number]',
    date: dateStr,
    letter,
    wordCount: letter.split(/\s+/).length,
    sections: [
      { heading: 'Your Information', content: `${userInfo.fullName} | ${userInfo.address || ''} ${userInfo.city || ''} ${userInfo.state || ''}` },
      { heading: 'Creditor', content: creditorName },
      { heading: 'Account', content: accountNumber || '[Account Number]' },
      { heading: 'Reason', content: reason || template.reason }
    ]
  };
}

/**
 * Get the body content for a specific template type.
 */
function getTemplateContent(templateId, params) {
  const templates = {
    'incorrect-balance': {
      name: 'Incorrect Balance',
      reason: 'The reported balance on this account is incorrect.',
      get body() {
        return `I am writing to dispute the balance reported for account #${params.accountNumber || '[Account Number]'} with ${params.creditorName}.

According to my records, the balance on this account is not accurately reported. ${params.reason || 'The amount shown on my credit report does not match my records.'}

Please investigate this matter and correct the balance as soon as possible. I have enclosed copies of my records showing the correct balance.

Under the Fair Credit Reporting Act (FCRA), you are required to investigate this dispute within 30 days and correct any inaccuracies.`;
      }
    },
    'not-my-account': {
      name: 'Not My Account',
      reason: 'This account does not belong to me.',
      get body() {
        return `I am writing to dispute the account #${params.accountNumber || '[Account Number]'} listed under my name with ${params.creditorName}.

This account does not belong to me. I have no knowledge of opening this account or authorizing any charges on it. ${params.reason || 'This may be a case of identity theft or a clerical error.'}

Please remove this account from my credit report immediately. I request that you provide validation of this debt, including a signed contract or application bearing my signature.

Under the Fair Credit Reporting Act (FCRA), inaccurate information must be corrected or removed upon investigation.`;
      }
    },
    'paid-in-full': {
      name: 'Paid in Full',
      reason: 'This account was paid in full.',
      get body() {
        return `I am writing to dispute the balance reported for account #${params.accountNumber || '[Account Number]'} with ${params.creditorName}.

This account has been paid in full. Despite this, ${params.reason || 'it continues to show an outstanding balance on my credit report.'}

Please update your records to show this account as "Paid in Full" with a $0 balance, and update the reporting to all three credit bureaus accordingly.

I have enclosed proof of payment for your reference.`;
      }
    },
    'outdated-info': {
      name: 'Outdated Information',
      reason: 'This negative item is past the reporting time limit.',
      get body() {
        return `I am writing to dispute the following item from ${params.creditorName} on my credit report: Account #${params.accountNumber || '[Account Number]'}.

Pursuant to the Fair Credit Reporting Act (FCRA) Section 605, most negative information can only be reported for 7 years (10 years for bankruptcy). ${params.reason || 'This item is past the allowable reporting period and should be removed.'}

Please remove this outdated information from my credit report immediately. Failing to do so is a violation of federal law.`;
      }
    },
    'identity-theft': {
      name: 'Identity Theft',
      reason: 'This account was opened fraudulently.',
      get body() {
        return `I am writing to dispute the account #${params.accountNumber || '[Account Number]'} with ${params.creditorName} because it is the result of identity theft.

I did not open this account and did not authorize any transactions on it. ${params.reason || 'I have filed a report with the Federal Trade Commission (FTC) and a police report regarding this identity theft.'}

Pursuant to the Fair Credit Reporting Act (FCRA) and the Fair and Accurate Credit Transactions Act (FACTA), you must block this information from my credit report.

Please send me copies of any documentation you have related to this account, including the original application. I have included a copy of my FTC Identity Theft Report and police report.`;
      }
    },
    'incorrect-late-payment': {
      name: 'Incorrect Late Payment',
      reason: 'This payment was made on time.',
      get body() {
        return `I am writing to dispute a late payment reported on account #${params.accountNumber || '[Account Number]'} with ${params.creditorName}.

I believe this late payment is reported in error. ${params.reason || 'I made the payment on or before the due date, and have records to prove this.'}

Please investigate this matter and correct the reporting. I have enclosed copies of bank statements and payment confirmations showing that this payment was made on time.

Under the FCRA, you must investigate and correct this error within 30 days.`;
      }
    }
  };

  return templates[templateId] || templates['incorrect-balance'];
}

// ─── Dispute Tracking ────────────────────────────────────────────

const disputeStore = new Map();

/**
 * Create a new dispute tracking record.
 * @param {object} params - { creditorName, accountNumber, templateId, userInfo, reason }
 * @returns {{disputeId: string, status: string, createdAt: string}}
 */
export function createDispute(params = {}) {
  const disputeId = `DSP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const dispute = {
    disputeId,
    status: DISPUTE_STATUSES.DRAFT,
    ...params,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [{ status: DISPUTE_STATUSES.DRAFT, timestamp: new Date().toISOString(), note: 'Dispute letter drafted' }]
  };

  disputeStore.set(disputeId, dispute);
  return { disputeId, status: dispute.status, createdAt: dispute.createdAt };
}

/**
 * Update the status of a dispute.
 * @param {string} disputeId - Dispute identifier
 * @param {string} status - New status from DISPUTE_STATUSES
 * @param {string} note - Optional note about the update
 * @returns {object|null} Updated dispute or null if not found
 */
export function trackDispute(disputeId, status, note = '') {
  const dispute = disputeStore.get(disputeId);
  if (!dispute) {
    throw new Error(`Dispute not found: ${disputeId}`);
  }

  if (!Object.values(DISPUTE_STATUSES).includes(status)) {
    throw new Error(`Invalid dispute status: ${status}. Valid: ${Object.values(DISPUTE_STATUSES).join(', ')}`);
  }

  dispute.status = status;
  dispute.updatedAt = new Date().toISOString();
  dispute.timeline.push({
    status,
    timestamp: new Date().toISOString(),
    note: note || `Status changed to ${status}`
  });

  disputeStore.set(disputeId, dispute);
  return {
    disputeId: dispute.disputeId,
    status: dispute.status,
    updatedAt: dispute.updatedAt,
    timeline: dispute.timeline
  };
}

/**
 * Get a dispute by ID.
 * @param {string} disputeId
 * @returns {object|null}
 */
export function getDispute(disputeId) {
  return disputeStore.get(disputeId) || null;
}

/**
 * Get all disputes, optionally filtered by status.
 * @param {string} status - Optional filter by status
 * @returns {Array}
 */
export function listDisputes(status = null) {
  const all = Array.from(disputeStore.values());
  if (status) {
    return all.filter(d => d.status === status);
  }
  return all;
}

// ─── Credit Score Projection ─────────────────────────────────────

/**
 * Project credit score over time based on negative items and payment history.
 *
 * @param {number} currentScore - Current credit score (300-850)
 * @param {Array<{type: string, date: string}>} negativeItems - Negative items
 * @param {object} paymentHistory - { onTimePayments: number, latePayments: number, monthsOfHistory: number }
 * @returns {object} Projected scores over 6 and 12 months
 */
export function calculateCreditProjection(currentScore, negativeItems = [], paymentHistory = {}) {
  if (typeof currentScore !== 'number' || currentScore < 300 || currentScore > 850) {
    throw new Error('Credit score must be a number between 300 and 850');
  }

  const { onTimePayments = 0, latePayments = 0, monthsOfHistory = 0 } = paymentHistory;

  // Base: current score
  let score6mo = currentScore;
  let score12mo = currentScore;

  // Positive factors (increase)
  const paymentRatio = monthsOfHistory > 0 ? onTimePayments / (onTimePayments + latePayments) : 0;
  const positiveImpact = Math.round(paymentRatio * 40); // Up to +40 points for perfect payment history
  const ageImpact = Math.min(monthsOfHistory * 0.5, 20); // Up to +20 points for account age

  // Negative factors (decrease or block improvement)
  const negativePenalty = (negativeItems || []).reduce((sum, item) => {
    const typeInfo = NEGATIVE_ITEM_TYPES[item.type];
    return sum + (typeInfo ? typeInfo.severity * 3 : 3);
  }, 0);

  // Recent late payments hurt more
  const recentLatePenalty = latePayments * 5;

  // Project 6 months
  score6mo += Math.round(positiveImpact * 0.3); // Partial improvement in 6 months
  score6mo -= Math.min(negativePenalty * 0.2, 30); // Some negatives resolved
  score6mo -= Math.min(recentLatePenalty, 20);

  // Project 12 months
  score12mo += Math.round(positiveImpact * 0.6); // More improvement in 12 months
  score12mo -= Math.min(negativePenalty * 0.4, 50); // More negatives resolved/aged
  score12mo -= Math.min(recentLatePenalty * 0.5, 10); // Late payments age

  // Clamp to valid range
  score6mo = Math.max(300, Math.min(850, score6mo));
  score12mo = Math.max(300, Math.min(850, score12mo));

  // Factors affecting projection
  const keyFactors = [];

  if (paymentRatio > 0.9) keyFactors.push({ factor: 'Strong payment history', impact: 'positive', points: `+${Math.round(positiveImpact * 0.6)} at 12mo` });
  else if (paymentRatio > 0.7) keyFactors.push({ factor: 'Moderate payment history', impact: 'positive', points: `+${Math.round(positiveImpact * 0.4)} at 12mo` });
  else keyFactors.push({ factor: 'Late payments on record', impact: 'negative', points: `-${Math.min(recentLatePenalty, 20)} at 6mo` });

  if (negativeItems?.length > 0) {
    keyFactors.push({ factor: `${negativeItems.length} negative item${negativeItems.length > 1 ? 's' : ''} on record`, impact: 'negative', points: `-${Math.min(Math.round(negativePenalty * 0.2), 30)} at 6mo` });
  }

  return {
    currentScore,
    projected6Months: score6mo,
    projected12Months: score12mo,
    change6Months: score6mo - currentScore,
    change12Months: score12mo - currentScore,
    keyFactors,
    optimistic6Months: Math.min(850, score6mo + 15),
    optimistic12Months: Math.min(850, score12mo + 25),
    pessimistic6Months: Math.max(300, score6mo - 10),
    pessimistic12Months: Math.max(300, score12mo - 15),
    summary: score12mo > currentScore
      ? `Your score could improve by ${score12mo - currentScore} points in 12 months with continued good habits.`
      : `Score recovery may take longer due to recent negative items. Focus on on-time payments.`
  };
}

export default {
  assessCreditHealth,
  generateDisputeLetter,
  getDisputeTemplates,
  createDispute,
  trackDispute,
  getDispute,
  listDisputes,
  calculateCreditProjection,
  CREDIT_SCORE_RANGES,
  NEGATIVE_ITEM_TYPES,
  DISPUTE_STATUSES
};