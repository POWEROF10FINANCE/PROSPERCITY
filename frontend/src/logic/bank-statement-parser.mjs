/**
 * ProsperCity — Bank Statement Parser
 *
 * Parses CSV bank statements, auto-categorizes transactions,
 * generates monthly summaries, and detects spending patterns.
 * Handles common CSV formats (Chase, Bank of America, simple).
 */

// ─── Category Definitions ────────────────────────────────────────

export const CATEGORY_KEYWORDS = {
  'Groceries': ['grocery', 'supermarket', 'whole foods', 'kroger', 'safeway', 'walmart', 'target', 'costco', 'trader joe', 'aldi', 'publix', 'food', 'groceries'],
  'Rent': ['rent', 'lease', 'property management', 'apartment'],
  'Utilities': ['electric', 'power', 'gas bill', 'water bill', 'internet', 'phone bill', 'verizon', 'at&t', 't-mobile', 'comcast', 'xfinity', 'utility'],
  'Dining': ['restaurant', 'cafe', 'coffee', 'starbucks', 'mcdonald', 'chipotle', 'pizza', 'dining', 'takeout', 'doordash', 'ubereats', 'grubhub'],
  'Transportation': ['gas', 'shell', 'exxon', 'chevron', 'uber', 'lyft', 'taxi', 'transit', 'metro', 'bus fare', 'parking', 'toll'],
  'Entertainment': ['netflix', 'hulu', 'spotify', 'disney+', 'hbo', 'amazon prime', 'apple tv', 'movie', 'concert', 'game', 'gaming', 'subscription'],
  'Shopping': ['amazon', 'ebay', 'etsy', 'clothing', 'apparel', 'shoes', 'electronics', 'best buy', 'department store', 'mall'],
  'Healthcare': ['pharmacy', 'cvs', 'walgreens', 'doctor', 'hospital', 'clinic', 'dentist', 'vision', 'insurance copay', 'medical'],
  'Education': ['tuition', 'student loan', 'course', 'udemy', 'coursera', 'school', 'university', 'college', 'books'],
  'Income': ['deposit', 'payroll', 'salary', 'direct deposit', 'paycheck', 'transfer from', 'income', 'wage'],
  'Transfer': ['transfer', 'venmo', 'paypal', 'zelle', 'cash app', 'withdrawal'],
  'Savings': ['savings', 'emergency fund', 'investment', 'ira', '401k', 'brokerage']
};

export const DEFAULT_CATEGORY = 'Other';

// ─── CSV Parsing ─────────────────────────────────────────────────

/**
 * Parse a CSV bank statement string into an array of transaction objects.
 * Handles common formats: Chase, Bank of America, and simple 4-column.
 *
 * @param {string} csvText - Raw CSV text content
 * @returns {Array<{date: string, description: string, amount: number, category: string}>}
 */
export function parseCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') {
    throw new Error('CSV text must be a non-empty string');
  }

  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must contain at least a header row and one data row');
  }

  // Detect the format and extract header
  const headerLine = lines[0].trim();
  const headers = headerLine.split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));

  // Detect format based on column names
  const format = detectFormat(headers);

  const transactions = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      const parsed = parseLine(line, format, headers);
      if (parsed) {
        transactions.push({
          date: parsed.date,
          description: parsed.description,
          amount: parsed.amount,
          category: parsed.category || DEFAULT_CATEGORY
        });
      }
    } catch (e) {
      // Skip malformed lines but note them for debugging
      console.warn(`ProsperCity: Skipping malformed CSV line ${i + 1}: ${e.message}`);
    }
  }

  // Auto-categorize any uncategorized transactions
  return categorizeTransactions(transactions);
}

/**
 * Detect the CSV format from header names.
 * @param {Array<string>} headers - Lowercased header names
 * @returns {string} Format identifier
 */
function detectFormat(headers) {
  const headerStr = headers.join(' ');

  if (headerStr.includes('amount') && headerStr.includes('description') && headerStr.includes('date')) {
    if (headerStr.includes('type') || headerStr.includes('check')) {
      return 'chase'; // Chase: Date, Description, Type, Amount
    }
    return 'simple'; // Simple: Date, Description, Amount
  }

  if (headerStr.includes('transaction') && headerStr.includes('debit') && headerStr.includes('credit')) {
    return 'boa'; // Bank of America: Date, Description, Debit, Credit
  }

  // Default: assume simple format with first 3 columns being date, description, amount
  return 'simple';
}

/**
 * Parse a single CSV line based on detected format.
 */
function parseLine(line, format, headers) {
  // Handle quoted fields properly (simple split for now, handles basic cases)
  const fields = parseCSVLine(line);

  switch (format) {
    case 'chase': {
      // Chase: Date, Description, Type, Amount
      const date = fields[0]?.trim().replace(/"/g, '') || '';
      const desc = fields[1]?.trim().replace(/"/g, '') || '';
      const type = fields[2]?.trim().replace(/"/g, '').toLowerCase() || '';
      const amountStr = fields[3]?.trim().replace(/"/g, '').replace(/[$,]/g, '') || '0';
      const amount = parseFloat(amountStr) || 0;

      // Chase shows debits as positive in the Amount column, credits as negative or different type
      const finalAmount = type === 'debit' ? -Math.abs(amount) : Math.abs(amount);

      return { date, description: desc, amount: finalAmount, category: null };
    }

    case 'boa': {
      // Bank of America: Date, Description, Debit, Credit
      const date = fields[0]?.trim().replace(/"/g, '') || '';
      const desc = fields[1]?.trim().replace(/"/g, '') || '';
      const debitStr = fields[2]?.trim().replace(/"/g, '').replace(/[$,]/g, '') || '0';
      const creditStr = fields[3]?.trim().replace(/"/g, '').replace(/[$,]/g, '') || '0';
      const debit = parseFloat(debitStr) || 0;
      const credit = parseFloat(creditStr) || 0;

      const amount = debit > 0 ? -debit : credit;

      return { date, description: desc, amount, category: null };
    }

    case 'simple':
    default: {
      // Simple: Date, Description, Amount (or Date, Description, Debit, Credit)
      const date = fields[0]?.trim().replace(/"/g, '') || '';
      const desc = fields[1]?.trim().replace(/"/g, '') || '';
      let amount;

      if (fields.length >= 4) {
        // Try as debit/credit format
        const debitStr = fields[2]?.trim().replace(/"/g, '').replace(/[$,]/g, '') || '0';
        const creditStr = fields[3]?.trim().replace(/"/g, '').replace(/[$,]/g, '') || '0';
        const debit = parseFloat(debitStr) || 0;
        const credit = parseFloat(creditStr) || 0;
        amount = debit > 0 ? -debit : credit;
      } else {
        const amountStr = fields[2]?.trim().replace(/"/g, '').replace(/[$,]/g, '') || '0';
        amount = parseFloat(amountStr) || 0;
      }

      return { date, description: desc, amount, category: null };
    }
  }
}

/**
 * Parse a CSV line handling quoted fields.
 * @param {string} line 
 * @returns {Array<string>}
 */
function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current); // Last field

  return fields;
}

// ─── Auto-Categorization ────────────────────────────────────────

/**
 * Auto-categorize transactions based on description keyword matching.
 * @param {Array<{date: string, description: string, amount: number, category?: string}>} transactions
 * @returns {Array} Transactions with categories assigned
 */
export function categorizeTransactions(transactions) {
  return transactions.map(tx => {
    // Skip if already categorized
    if (tx.category && tx.category !== DEFAULT_CATEGORY) return tx;

    const desc = (tx.description || '').toLowerCase();

    // Income detection based on amount (positive = income in our format)
    if (tx.amount > 0) {
      const incomeMatch = matchCategory(desc, 'Income');
      if (incomeMatch) {
        return { ...tx, category: 'Income' };
      }
    }

    // Check all categories
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (category === 'Income' && tx.amount > 0) continue; // Already checked
      if (matchCategory(desc, category)) {
        return { ...tx, category };
      }
    }

    // Amount-based heuristics
    const absAmount = Math.abs(tx.amount);
    if (absAmount > 1000 && tx.amount < 0) {
      // Large payments might be rent
      if (desc.includes('rent') || desc.includes('lease')) {
        return { ...tx, category: 'Rent' };
      }
    }

    return { ...tx, category: DEFAULT_CATEGORY };
  });
}

/**
 * Check if a description matches a category's keywords.
 */
function matchCategory(description, categoryName) {
  const keywords = CATEGORY_KEYWORDS[categoryName];
  if (!keywords) return false;
  return keywords.some(keyword => description.includes(keyword.toLowerCase()));
}

// ─── Monthly Summary ─────────────────────────────────────────────

/**
 * Group transactions by month and compute summaries.
 * @param {Array<{date: string, description: string, amount: number, category: string}>} transactions
 * @returns {Array<{month: string, income: number, expenses: number, net: number, topCategories: Array}>}
 */
export function getMonthlySummary(transactions) {
  if (!Array.isArray(transactions)) throw new Error('Transactions must be an array');

  const byMonth = {};

  for (const tx of transactions) {
    // Extract YYYY-MM from date
    let monthKey;
    if (tx.date) {
      // Handle various date formats
      const dateStr = tx.date.replace(/\//g, '-');
      const dateParts = dateStr.split('-');
      if (dateParts.length >= 2) {
        let year, month;
        if (dateParts[0].length === 4) {
          year = dateParts[0];
          month = dateParts[1].padStart(2, '0');
        } else {
          month = dateParts[0].padStart(2, '0');
          year = dateParts[2] || new Date().getFullYear();
        }
        monthKey = `${year}-${month}`;
      } else {
        monthKey = `unknown-${Math.floor(Math.random() * 1000)}`;
      }
    } else {
      monthKey = 'unknown';
    }

    if (!byMonth[monthKey]) {
      byMonth[monthKey] = { income: 0, expenses: 0, categories: {} };
    }

    if (tx.amount > 0) {
      byMonth[monthKey].income += tx.amount;
    } else {
      const exp = Math.abs(tx.amount);
      byMonth[monthKey].expenses += exp;

      const cat = tx.category || DEFAULT_CATEGORY;
      if (!byMonth[monthKey].categories[cat]) {
        byMonth[monthKey].categories[cat] = 0;
      }
      byMonth[monthKey].categories[cat] += exp;
    }
  }

  // Build summary array sorted by month
  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => {
      const sortedCategories = Object.entries(data.categories)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5) // Top 5 categories
        .map(([name, amount]) => ({ name, amount: Math.round(amount * 100) / 100, percent: data.expenses > 0 ? Math.round((amount / data.expenses) * 100) : 0 }));

      return {
        month,
        income: Math.round(data.income * 100) / 100,
        expenses: Math.round(data.expenses * 100) / 100,
        net: Math.round((data.income - data.expenses) * 100) / 100,
        transactionCount: sortedCategories.reduce((sum, c) => sum + Math.round(c.amount / 10), 0),
        topCategories: sortedCategories
      };
    });
}

// ─── Pattern Detection ───────────────────────────────────────────

/**
 * Detect spending patterns in transactions: recurring expenses, trends, anomalies.
 * @param {Array<{date: string, description: string, amount: number, category: string}>} transactions
 * @returns {object} Detected patterns
 */
export function detectPatterns(transactions) {
  if (!Array.isArray(transactions)) throw new Error('Transactions must be an array');

  const patterns = {
    recurring: findRecurringExpenses(transactions),
    trends: analyzeSpendingTrends(transactions),
    anomalies: findUnusualCharges(transactions),
    summary: null
  };

  // Generate a natural-language summary of detected patterns
  const summaryParts = [];
  if (patterns.recurring.length > 0) {
    summaryParts.push(`Found ${patterns.recurring.length} recurring expenses totaling $${patterns.recurring.reduce((s, r) => s + r.amount, 0).toFixed(2)}/mo`);
  }
  if (patterns.trends.length > 0) {
    summaryParts.push(`Spending ${patterns.trends[0]?.direction || 'stable'} in ${patterns.trends[0]?.category || 'top categories'}`);
  }
  if (patterns.anomalies.length > 0) {
    summaryParts.push(`${patterns.anomalies.length} unusual charge${patterns.anomalies.length > 1 ? 's' : ''} detected`);
  }

  patterns.summary = summaryParts.length > 0 ? summaryParts.join('. ') + '.' : 'No significant patterns detected.';
  patterns.totalTransactions = transactions.length;

  return patterns;
}

/**
 * Find recurring expenses (same amount, similar description, appears 2+ times).
 */
function findRecurringExpenses(transactions) {
  const expenseGroups = {};

  for (const tx of transactions) {
    if (tx.amount >= 0) continue; // Skip income

    const absAmount = Math.abs(tx.amount);
    // Normalize description to find matches
    const normalizedDesc = (tx.description || '')
      .toLowerCase()
      .replace(/[0-9]/g, '') // Remove numbers
      .replace(/#\w+/g, '')  // Remove hashtags
      .trim();

    // Skip very small or very large transactions
    if (absAmount < 1 || absAmount > 10000) continue;

    const key = `${normalizedDesc}|${absAmount.toFixed(2)}`;

    if (!expenseGroups[key]) {
      expenseGroups[key] = {
        description: tx.description,
        amount: absAmount,
        category: tx.category,
        dates: [],
        count: 0
      };
    }
    expenseGroups[key].dates.push(tx.date);
    expenseGroups[key].count++;
  }

  // Filter to those appearing 2+ times (recurring)
  const recurring = Object.values(expenseGroups)
    .filter(g => g.count >= 2)
    .sort((a, b) => b.amount - a.amount);

  // Add frequency label
  return recurring.map(r => ({
    ...r,
    frequency: r.count >= 4 ? 'monthly' : r.count >= 3 ? 'bi-weekly' : 'occasional',
    confidence: r.count >= 4 ? 'high' : r.count >= 3 ? 'medium' : 'low'
  }));
}

/**
 * Analyze spending trends by category over time.
 */
function analyzeSpendingTrends(transactions) {
  const byCategory = {};

  for (const tx of transactions) {
    if (tx.amount >= 0) continue;
    const cat = tx.category || DEFAULT_CATEGORY;
    if (!byCategory[cat]) {
      byCategory[cat] = { total: 0, count: 0 };
    }
    byCategory[cat].total += Math.abs(tx.amount);
    byCategory[cat].count++;
  }

  const entries = Object.entries(byCategory)
    .map(([category, data]) => ({
      category,
      total: Math.round(data.total * 100) / 100,
      count: data.count,
      avgPerTx: Math.round((data.total / data.count) * 100) / 100
    }))
    .sort((a, b) => b.total - a.total);

  // Determine trend direction for top categories
  return entries.slice(0, 5).map(e => ({
    ...e,
    direction: e.total > 500 ? 'increasing' : e.total > 100 ? 'stable' : 'minimal'
  }));
}

/**
 * Find unusual or potentially fraudulent charges.
 */
function findUnusualCharges(transactions) {
  const expenses = transactions.filter(tx => tx.amount < 0);
  if (expenses.length === 0) return [];

  const amounts = expenses.map(tx => Math.abs(tx.amount));
  const mean = amounts.reduce((s, a) => s + a, 0) / amounts.length;
  const stdDev = Math.sqrt(amounts.reduce((s, a) => s + Math.pow(a - mean, 2), 0) / amounts.length);

  // Flag transactions > 3 standard deviations from mean as anomalies
  const threshold = mean + 3 * stdDev;

  return expenses
    .filter(tx => Math.abs(tx.amount) > threshold && Math.abs(tx.amount) > 100)
    .map(tx => ({
      date: tx.date,
      description: tx.description,
      amount: Math.abs(tx.amount),
      category: tx.category,
      reason: Math.abs(tx.amount) > mean * 5 ? 'Significantly higher than average' : 'Unusually large transaction',
      avgTransaction: Math.round(mean * 100) / 100
    }));
}

// ─── Export Helpers ──────────────────────────────────────────────

/**
 * Validate that transaction data is well-formed.
 * @param {Array} transactions 
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateTransactions(transactions) {
  const errors = [];

  if (!Array.isArray(transactions)) {
    return { valid: false, errors: ['Transactions must be an array'] };
  }

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];
    if (!tx.date) errors.push(`Row ${i + 1}: Missing date`);
    if (!tx.description) errors.push(`Row ${i + 1}: Missing description`);
    if (typeof tx.amount !== 'number') errors.push(`Row ${i + 1}: Amount must be a number`);
  }

  return {
    valid: errors.length === 0,
    errors,
    totalTransactions: transactions.length
  };
}

export default {
  parseCSV,
  categorizeTransactions,
  getMonthlySummary,
  detectPatterns,
  validateTransactions,
  CATEGORY_KEYWORDS,
  DEFAULT_CATEGORY
};