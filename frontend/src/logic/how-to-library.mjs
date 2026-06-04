/**
 * ProsperCity — How-To Library
 *
 * Library of financial how-to articles with search, filter,
 * and related article linking capabilities.
 */

// ─── Library Data ─────────────────────────────────────────────────

export const ARTICLES = [
  {
    id: 'dispute-a-debt',
    title: 'How to Dispute a Debt',
    category: 'credit-repair',
    difficulty: 'intermediate',
    summary: 'Learn the step-by-step process to dispute inaccurate or unfair debts on your credit report.',
    steps: [
      'Get your free credit report from AnnualCreditReport.com',
      'Identify inaccurate, outdated, or unverified negative items',
      'Gather supporting documentation (bank records, payment confirmations, identity documents)',
      'Write a formal dispute letter to the credit bureau (Equifax, Experian, or TransUnion)',
      'Send the letter via Certified Mail with Return Receipt Requested',
      'Wait 30 days for the bureau to investigate (by law under FCRA)',
      'If the item is not removed, file a dispute directly with the creditor',
      'Follow up with the Consumer Financial Protection Bureau (CFPB) if needed'
    ],
    estimatedTime: '30–60 days for initial response',
    relatedArticles: ['fix-your-credit', 'read-credit-report', 'build-credit-from-scratch'],
    tags: ['dispute', 'debt', 'credit report', 'FCRA', 'collection'],
    tip: 'Always send dispute letters via Certified Mail so you have proof of delivery. This creates a paper trail the credit bureaus can\'t ignore.'
  },
  {
    id: 'apply-personal-loan',
    title: 'How to Apply for a Personal Loan',
    category: 'loans',
    difficulty: 'beginner',
    summary: 'A complete guide to finding, comparing, and applying for personal loans with confidence.',
    steps: [
      'Check your credit score (know where you stand before applying)',
      'Determine how much you need and what you can afford to repay monthly',
      'Shop around and compare rates from at least 3-5 lenders (banks, credit unions, online)',
      'Pre-qualify with lenders that do a soft credit pull (won\'t hurt your score)',
      'Compare APRs, fees, loan terms, and monthly payments side-by-side',
      'Gather required documents: ID, proof of income, bank statements, proof of address',
      'Submit your formal application with your chosen lender',
      'Review the loan agreement carefully before signing — watch for origination fees and prepayment penalties',
      'Set up autopay to avoid late payments (many lenders offer a rate discount for this)'
    ],
    estimatedTime: '1–3 days from research to funding',
    relatedArticles: ['fix-your-credit', 'create-a-budget', 'pay-off-loans-faster'],
    tags: ['loan', 'personal loan', 'borrowing', 'credit', 'APR'],
    tip: 'Applying for multiple loans within a 14-45 day window counts as a single hard inquiry on your credit score, so do all your rate shopping in that window.'
  },
  {
    id: 'fix-your-credit',
    title: 'How to Fix Your Credit',
    category: 'credit-repair',
    difficulty: 'intermediate',
    summary: 'A systematic approach to improving your credit score through proven strategies and good habits.',
    steps: [
      'Get your credit reports from all three bureaus (Equifax, Experian, TransUnion)',
      'Review each report for errors, outdated items, and signs of identity theft',
      'Dispute any inaccuracies you find (see "How to Dispute a Debt")',
      'Pay all bills on time going forward — payment history is 35% of your score',
      'Reduce credit card balances to below 30% of your credit limit (utilization ratio)',
      'Keep old credit accounts open to maintain length of credit history (15% of score)',
      'Limit new credit applications — each hard inquiry dings your score temporarily',
      'Consider becoming an authorized user on a trusted person\'s well-managed card',
      'Monitor your progress monthly — use a free credit monitoring service'
    ],
    estimatedTime: '3–12 months to see meaningful improvement',
    relatedArticles: ['dispute-a-debt', 'build-credit-from-scratch', 'read-credit-report'],
    tags: ['credit repair', 'credit score', 'FICO', 'improvement', 'credit health'],
    tip: 'Your credit utilization ratio is the second most important factor after payment history. Paying down high balances is often the fastest way to boost your score.'
  },
  {
    id: 'pay-off-loans-faster',
    title: 'How to Pay Off Loans Faster',
    category: 'debt-management',
    difficulty: 'beginner',
    summary: 'Strategies to accelerate debt repayment and save money on interest, including the debt snowball and avalanche methods.',
    steps: [
      'List all your debts with balances, interest rates, and minimum payments',
      'Choose a payoff strategy: Debt Avalanche (highest interest first — saves most money) or Debt Snowball (smallest balance first — builds momentum)',
      'Create a bare-bones budget to free up extra money for debt payments',
      'Make more than the minimum payment on your target debt each month',
      'Consider a balance transfer to a 0% APR card (watch for transfer fees)',
      'Use windfalls (tax refunds, bonuses, gifts) to make lump-sum payments',
      'Refinance high-interest loans to lower rates if you qualify',
      'Celebrate each debt paid off — track your progress visually',
      'Once all debts are paid, redirect that payment amount to savings and investments'
    ],
    estimatedTime: 'Varies — most debts can be accelerated by 30-50%',
    relatedArticles: ['create-a-budget', 'save-for-emergency-fund', 'apply-personal-loan'],
    tags: ['debt', 'payoff', 'snowball', 'avalanche', 'interest', 'repayment'],
    tip: 'The Debt Avalanche method saves you the most money, but the Debt Snowball method has a higher success rate because the quick wins keep you motivated.'
  },
  {
    id: 'create-a-budget',
    title: 'How to Create a Budget',
    category: 'budgeting',
    difficulty: 'beginner',
    summary: 'A simple, practical guide to creating your first budget using the 50/30/20 rule.',
    steps: [
      'Calculate your total monthly income after taxes (take-home pay)',
      'Track every dollar you spent last month — use bank statements or a spending app',
      'Categorize expenses into Needs, Wants, and Savings/Debt',
      'Apply the 50/30/20 rule: 50% Needs, 30% Wants, 20% Savings + Debt Repayment',
      'Set specific spending limits for each category',
      'Use the envelope system or a budgeting app to track in real time',
      'Review and adjust your budget weekly for the first month',
      'Automate savings transfers on payday so you never miss a contribution',
      'Build in some fun money — a strict budget that doesn\'t allow joy won\'t last'
    ],
    estimatedTime: '1-2 hours to set up, 10 minutes weekly to maintain',
    relatedArticles: ['save-for-emergency-fund', 'pay-off-loans-faster', 'build-credit-from-scratch'],
    tags: ['budget', 'budgeting', '50/30/20', 'money management', 'spending'],
    tip: 'Use the 50/30/20 rule as a starting point, but adjust based on your situation. If you live in a high-cost city, your Needs might be 60% — that\'s okay, just adjust your Wants accordingly.'
  },
  {
    id: 'read-credit-report',
    title: 'How to Read a Credit Report',
    category: 'credit-repair',
    difficulty: 'beginner',
    summary: 'Understand every section of your credit report so you can spot errors and track your financial health.',
    steps: [
      'Get your free credit report from AnnualCreditReport.com (once per week through 2025)',
      'Start with the Personal Information section — verify name, address, SSN, and employer',
      'Review the Accounts section (Trade Lines) — check each account status, balance, payment history',
      'Check the Inquiries section — hard inquiries (from applications) vs soft inquiries (pre-approvals)',
      'Review Public Records and Collections — bankruptcies, judgments, tax liens, collection accounts',
      'Look for errors: incorrect balances, accounts that aren\'t yours, outdated negative items',
      'Note the date of each negative item — most must be removed after 7 years (10 for bankruptcy)',
      'Compare all three bureau reports — they may have different information',
      'If you find errors, dispute them immediately with the bureau and the creditor'
    ],
    estimatedTime: '30–60 minutes per report review',
    relatedArticles: ['dispute-a-debt', 'fix-your-credit', 'build-credit-from-scratch'],
    tags: ['credit report', 'credit bureau', 'FCRA', 'review', 'check'],
    tip: 'You\'re entitled to one free credit report from each bureau every 12 months. Stagger them: request one every 4 months to monitor your credit year-round.'
  },
  {
    id: 'build-credit-from-scratch',
    title: 'How to Build Credit from Scratch',
    category: 'credit-repair',
    difficulty: 'beginner',
    summary: 'A step-by-step guide for building your first credit history with no prior credit.',
    steps: [
      'Get a secured credit card — you put down a deposit that becomes your credit limit',
      'Use the card for small, regular purchases (e.g., Netflix subscription, gas)',
      'Pay the FULL statement balance every month on time — never carry a balance',
      'After 6-12 months of on-time payments, ask to convert to an unsecured card',
      'Become an authorized user on a family member\'s well-managed credit card',
      'Apply for a credit-builder loan at a credit union (you make payments first, get the money later)',
      'Keep your credit utilization below 30% (ideally under 10%)',
      'Limit credit applications to 1-2 per year to avoid too many hard inquiries',
      'Monitor your credit score for free through your bank or a free service'
    ],
    estimatedTime: '6–12 months to establish a credit score, 2+ years for a good score',
    relatedArticles: ['fix-your-credit', 'read-credit-report', 'create-a-budget'],
    tags: ['credit building', 'secured card', 'authorized user', 'credit history', 'beginner'],
    tip: 'A secured card is the most reliable way to build credit from nothing. Look for one that reports to all three bureaus and has a path to upgrade to an unsecured card.'
  },
  {
    id: 'save-for-emergency-fund',
    title: 'How to Save for an Emergency Fund',
    category: 'savings',
    difficulty: 'beginner',
    summary: 'Build your financial safety net with a practical emergency fund savings plan.',
    steps: [
      'Calculate your monthly essential expenses (rent, food, utilities, transportation, minimum debt payments)',
      'Set your initial goal: $1,000 starter fund (for those with debt) or 1 month of expenses',
      'Open a separate high-yield savings account for your emergency fund only',
      'Set up automatic transfers from checking to savings on each payday',
      'Start with a small, achievable amount — even $25 per week adds up',
      'Sell unused items, pick up a side gig, or redirect windfalls to accelerate savings',
      'After reaching your first milestone, aim for 3 months of expenses (minimum recommendation)',
      'If you have unstable income, aim for 6 months of expenses',
      'Only use the fund for TRUE emergencies — job loss, medical emergencies, urgent car repair',
      'Replenish the fund after any emergency withdrawal'
    ],
    estimatedTime: '3–12 months to build a 3-month emergency fund (depending on income and expenses)',
    relatedArticles: ['create-a-budget', 'pay-off-loans-faster', 'build-credit-from-scratch'],
    tags: ['emergency fund', 'savings', 'rainy day', 'financial safety net', 'saving'],
    tip: 'Keep your emergency fund in a high-yield savings account (currently earning 4-5% APY), not a checking account where you\'ll be tempted to spend it.'
  },
  {
    id: 'lower-credit-card-interest',
    title: 'How to Lower Your Credit Card Interest Rate',
    category: 'debt-management',
    difficulty: 'intermediate',
    summary: 'Proven strategies to negotiate lower APRs on your credit cards and reduce interest costs.',
    steps: [
      'Check your current APR, credit score, and payment history (lenders consider these)',
      'Research competitor offers — know what rates other cards are offering',
      'Call your credit card issuer\'s customer service line',
      'Be polite and direct: "I\'ve been a loyal customer for X years with on-time payments. Can you lower my APR?"',
      'Mention competitor offers if your request is initially denied',
      'If they say no, ask to speak to the retention department',
      'Consider a balance transfer to a 0% APR card if they won\'t lower your rate',
      'Get any rate reduction in writing before accepting',
      'Keep using the card responsibly to maintain the lower rate'
    ],
    estimatedTime: '30–60 minutes on the phone, results vary',
    relatedArticles: ['pay-off-loans-faster', 'fix-your-credit', 'apply-personal-loan'],
    tags: ['credit card', 'APR', 'interest rate', 'negotiation', 'debt'],
    tip: 'The best time to call is after you\'ve had 6+ months of on-time payments. Loyal customers with good payment history have the most leverage.'
  },
  {
    id: 'increase-credit-limit',
    title: 'How to Request a Credit Limit Increase',
    category: 'credit-repair',
    difficulty: 'beginner',
    summary: 'Increase your credit limit to improve your credit utilization ratio and boost your score.',
    steps: [
      'Check your current credit score — most issuers require good/excellent credit',
      'Ensure you\'ve had the card for at least 6-12 months',
      'Log in to your online account and check if a credit limit increase is available',
      'Request online (soft pull) or call customer service (may be hard pull)',
      'State your desired new limit and reason (e.g., "to better manage my utilization")',
      'Report your current income accurately if asked',
      'If approved, your credit utilization drops immediately — potentially boosting your score',
      'If denied, ask what you can improve and try again in 3-6 months',
      'Don\'t increase your spending just because your limit went up'
    ],
    estimatedTime: '5-15 minutes online, instant decision often',
    relatedArticles: ['fix-your-credit', 'build-credit-from-scratch', 'read-credit-report'],
    tags: ['credit limit', 'credit utilization', 'credit card', 'score boost'],
    tip: 'Request credit limit increases with soft pull issuers (those that don\'t do a hard inquiry). Hard inquiries can temporarily lower your score by a few points.'
  },
  {
    id: 'negotiate-medical-bills',
    title: 'How to Negotiate Medical Bills',
    category: 'debt-management',
    difficulty: 'intermediate',
    summary: 'Navigate medical billing, negotiate discounts, and set up payment plans for healthcare expenses.',
    steps: [
      'Wait until you receive the full Explanation of Benefits (EOB) from your insurance',
      'Review the bill for errors — duplicate charges, incorrect codes, services not received',
      'Request an itemized bill from the provider',
      'Research fair market prices for the services using HealthcareBlueBook.com',
      'Contact the billing department and ask about discounts for prompt payment',
      'Offer to pay 50-70% of the balance in a lump sum if they\'ll write off the rest',
      'Set up an interest-free payment plan if a lump sum isn\'t possible',
      'Apply for financial assistance or charity care programs',
      'If the bill goes to collections, negotiate a pay-for-delete agreement'
    ],
    estimatedTime: '1-3 months from bill receipt to resolution',
    relatedArticles: ['dispute-a-debt', 'fix-your-credit', 'save-for-emergency-fund'],
    tags: ['medical bills', 'negotiation', 'healthcare', 'billing', 'debt'],
    tip: 'Many hospitals have financial assistance programs that can reduce or eliminate your bill. Ask about "charity care" before agreeing to a payment plan.'
  },
  {
    id: 'check-credit-score-free',
    title: 'How to Check Your Credit Score for Free',
    category: 'credit-repair',
    difficulty: 'beginner',
    summary: 'Legitimate ways to check your credit score for free without hurting your credit.',
    steps: [
      'Use a free credit monitoring service (Credit Karma, Credit Sesame, WalletHub)',
      'Check if your bank or credit card issuer offers free credit scores',
      'Visit AnnualCreditReport.com for free weekly credit reports (through 2025)',
      'Use the free scores from Discover Scorecard (no Discover card required)',
      'Understand the difference: VantageScore vs FICO (lenders mostly use FICO)',
      'Check all three bureaus: Equifax, Experian, and TransUnion',
      'Set up alerts for score changes so you know immediately if something changes',
      'Review your full credit report at least once a year, not just your score'
    ],
    estimatedTime: '5 minutes to check, 30 minutes for full report review',
    relatedArticles: ['read-credit-report', 'fix-your-credit', 'build-credit-from-scratch'],
    tags: ['credit score', 'free', 'monitoring', 'FICO', 'VantageScore', 'check'],
    tip: 'Checking your own credit score or report is a "soft inquiry" and NEVER hurts your credit score. Check as often as you like!'
  }
];

// ─── Search & Filter Functions ────────────────────────────────────

/**
 * Get all articles, optionally filtered by category.
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered articles
 */
export function getArticlesByCategory(category) {
  if (!category) return ARTICLES;
  return ARTICLES.filter(a => a.category === category);
}

/**
 * Search articles by keyword (searches title, summary, tags, and steps).
 * @param {string} query - Search query string
 * @returns {Array} Matching articles with relevance score
 */
export function searchArticles(query) {
  if (!query || typeof query !== 'string') return [];

  const keywords = query.toLowerCase().trim().split(/\s+/).filter(k => k.length > 2);

  if (keywords.length === 0) return [];

  const results = ARTICLES.map(article => {
    let score = 0;
    const searchableText = [
      article.title,
      article.summary,
      ...(article.tags || []),
      ...article.steps
    ].join(' ').toLowerCase();

    for (const keyword of keywords) {
      // Exact title match = highest score
      if (article.title.toLowerCase().includes(keyword)) score += 10;
      // Tag match = high score
      if (article.tags?.some(t => t.includes(keyword))) score += 8;
      // Summary match = medium score
      if (article.summary.toLowerCase().includes(keyword)) score += 5;
      // Step match = low score
      if (article.steps.some(s => s.toLowerCase().includes(keyword))) score += 2;
    }

    return { ...article, relevanceScore: score };
  });

  return results
    .filter(a => a.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Get a full article by ID.
 * @param {string} id - Article identifier
 * @returns {object|null} Article or null
 */
export function getArticle(id) {
  if (!id) return null;
  return ARTICLES.find(a => a.id === id) || null;
}

/**
 * Get related articles for a given article.
 * @param {string} articleId - Article ID to find related for
 * @returns {Array} Related articles
 */
export function getRelatedArticles(articleId) {
  const article = ARTICLES.find(a => a.id === articleId);
  if (!article || !article.relatedArticles) return [];

  return article.relatedArticles
    .map(relatedId => ARTICLES.find(a => a.id === relatedId))
    .filter(Boolean);
}

// ─── Library Metadata ────────────────────────────────────────────

/**
 * Get all available categories with article counts.
 * @returns {Array<{name: string, count: number}>}
 */
export function getCategories() {
  const counts = {};
  for (const article of ARTICLES) {
    if (!counts[article.category]) counts[article.category] = 0;
    counts[article.category]++;
  }

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));
}

/**
 * Get difficulty distribution of the library.
 * @returns {object} Counts by difficulty
 */
export function getDifficultyDistribution() {
  const counts = { beginner: 0, intermediate: 0, advanced: 0 };
  for (const article of ARTICLES) {
    if (counts[article.difficulty] !== undefined) {
      counts[article.difficulty]++;
    }
  }
  return counts;
}

/**
 * Search suggestions based on query prefix.
 * @param {string} prefix - Search prefix
 * @param {number} limit - Max suggestions (default: 5)
 * @returns {Array<string>} Suggested search terms
 */
export function getSearchSuggestions(prefix, limit = 5) {
  if (!prefix || prefix.length < 2) return [];

  const lower = prefix.toLowerCase();
  const suggestions = new Set();

  for (const article of ARTICLES) {
    if (article.title.toLowerCase().includes(lower)) suggestions.add(article.title);
    for (const tag of (article.tags || [])) {
      if (tag.includes(lower)) suggestions.add(tag);
    }
  }

  return Array.from(suggestions).slice(0, limit);
}

export default {
  ARTICLES,
  getArticlesByCategory,
  searchArticles,
  getArticle,
  getRelatedArticles,
  getCategories,
  getDifficultyDistribution,
  getSearchSuggestions
};