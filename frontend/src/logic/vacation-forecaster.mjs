/**
 * ProsperCity — Vacation Forecaster
 * 
 * Pure ES module for vacation cost projection, destination comparison,
 * savings timeline calculation, and hidden cost management.
 */

// ─── Destination Data ─────────────────────────────────────────────

export const DESTINATIONS = [
  {
    id: 'sunny-beach',
    name: 'Sunny Beach',
    emoji: '🏖️',
    transport: 200,
    transportLabel: 'Flight',
    hotelPerNight: 100,
    foodPerDay: 30,
    activities: 150,
    hiddenCosts: [
      { name: 'Baggage Fee', amount: 50 },
      { name: 'Travel Insurance', amount: 30 }
    ]
  },
  {
    id: 'mountain-peak',
    name: 'Mountain Peak',
    emoji: '🏔️',
    transport: 150,
    transportLabel: 'Bus',
    hotelPerNight: 80,
    foodPerDay: 25,
    activities: 100,
    hiddenCosts: [
      { name: 'Baggage Fee', amount: 35 },
      { name: 'Travel Insurance', amount: 25 }
    ]
  },
  {
    id: 'big-city',
    name: 'Big City',
    emoji: '🏙️',
    transport: 250,
    transportLabel: 'Flight',
    hotelPerNight: 120,
    foodPerDay: 40,
    activities: 200,
    hiddenCosts: [
      { name: 'Baggage Fee', amount: 60 },
      { name: 'Travel Insurance', amount: 35 }
    ]
  }
];

// ─── Core Vacation Functions ─────────────────────────────────────

/**
 * Calculate total cost for a vacation destination.
 * 
 * @param {string|object} destination - Destination ID string or destination object
 * @param {number} nights - Number of nights staying
 * @param {object} options - Optional overrides
 * @param {number} options.transportCost - Override transport cost
 * @param {number} options.foodPerDay - Override food cost per day
 * @param {number} options.activitiesCost - Override activities cost
 * @param {boolean} options.includeHiddenCosts - Whether to add hidden costs
 * @returns {object} Cost breakdown
 */
export function calculateTripCost(destination, nights = 5, options = {}) {
  const dest = typeof destination === 'string'
    ? DESTINATIONS.find(d => d.id === destination)
    : destination;

  if (!dest) throw new Error(`Destination not found: ${destination}`);

  const transportCost = options.transportCost ?? dest.transport;
  const hotelCost = dest.hotelPerNight * nights;
  const foodCost = (options.foodPerDay ?? dest.foodPerDay) * (nights + 1); // food covers travel days too
  const activitiesCost = options.activitiesCost ?? dest.activities;

  const baseTotal = transportCost + hotelCost + foodCost + activitiesCost;

  // Optional hidden costs
  let hiddenCosts = [];
  if (options.includeHiddenCosts) {
    hiddenCosts = (dest.hiddenCosts || []).map(hc => ({
      ...hc,
      isHidden: true
    }));
  }

  const hiddenTotal = hiddenCosts.reduce((sum, hc) => sum + hc.amount, 0);
  const grandTotal = baseTotal + hiddenTotal;

  return {
    destination: { id: dest.id, name: dest.name, emoji: dest.emoji },
    nights,
    breakdown: {
      transport: { label: dest.transportLabel, amount: transportCost },
      hotel: { label: 'Hotel', amount: hotelCost, perNight: dest.hotelPerNight },
      food: { label: 'Food', amount: foodCost, perDay: options.foodPerDay ?? dest.foodPerDay },
      activities: { label: 'Activities', amount: activitiesCost }
    },
    hiddenCosts,
    baseTotal,
    hiddenTotal,
    grandTotal,
    withinBudget: null // To be set by checkBudget
  };
}

/**
 * Check if a trip cost fits within a budget.
 * 
 * @param {number} tripCost - Grand total of trip
 * @param {number} budget - Available budget
 * @returns {object} Budget check result
 */
export function checkTripBudget(tripCost, budget) {
  const remaining = budget - tripCost;
  return {
    budget,
    tripCost,
    remaining: Math.round(remaining * 100) / 100,
    withinBudget: remaining >= 0,
    overBy: remaining < 0 ? Math.abs(remaining) : 0,
    percentUsed: Math.round((tripCost / budget) * 100 * 10) / 10
  };
}

/**
 * Calculate savings timeline for a vacation goal.
 * 
 * @param {number} tripCost - Total trip cost
 * @param {number} currentSavings - Amount already saved
 * @param {number} monthlySaving - Amount saved per month
 * @returns {object} Savings timeline
 */
export function calculateVacationSavingsTimeline(tripCost, currentSavings = 0, monthlySaving = 0) {
  if (tripCost <= 0) throw new Error('Trip cost must be positive');
  if (monthlySaving < 0) throw new Error('Monthly saving must be non-negative');

  const remaining = Math.max(0, tripCost - currentSavings);

  if (monthlySaving <= 0) {
    return {
      tripCost,
      currentSavings,
      monthlySaving: 0,
      remaining,
      monthsToGoal: Infinity,
      yearsToGoal: Infinity,
      progressPercent: currentSavings > 0 ? Math.min(100, Math.round((currentSavings / tripCost) * 100)) : 0,
      achievable: false,
      needsIncome: true
    };
  }

  const monthsToGoal = Math.ceil(remaining / monthlySaving);

  return {
    tripCost,
    currentSavings,
    monthlySaving,
    remaining,
    monthsToGoal,
    yearsToGoal: Math.round((monthsToGoal / 12) * 10) / 10,
    progressPercent: Math.min(100, Math.round((currentSavings / tripCost) * 100)),
    achievable: monthsToGoal < 1200,
    needsIncome: false
  };
}

/**
 * Split costs among a group of people.
 * 
 * @param {number} totalCost - Total cost to split
 * @param {number} people - Number of people
 * @param {Array<{name: string, adjustment?: number}>} customSplits - Optional custom splits
 * @returns {object} Split breakdown
 */
export function splitTripCost(totalCost, people = 1, customSplits = null) {
  if (people <= 0) throw new Error('Number of people must be positive');

  // Equal split
  if (!customSplits || customSplits.length === 0) {
    const perPerson = Math.round((totalCost / people) * 100) / 100;
    const splits = Array.from({ length: people }, (_, i) => ({
      person: `Person ${i + 1}`,
      amount: perPerson,
      isCustom: false
    }));

    return {
      totalCost,
      people,
      perPerson,
      splits,
      method: 'equal'
    };
  }

  // Custom split with adjustments
  const totalAdjustment = customSplits.reduce((sum, p) => sum + (p.adjustment || 0), 0);
  const equalShare = Math.round((totalCost / customSplits.length) * 100) / 100;

  const splits = customSplits.map(p => ({
    person: p.name,
    amount: Math.round((equalShare + (p.adjustment || 0)) * 100) / 100,
    adjustment: p.adjustment || 0,
    isCustom: true
  }));

  return {
    totalCost,
    people: customSplits.length,
    perPerson: equalShare,
    splits,
    method: 'custom'
  };
}

/**
 * Validate a trip budget allocation.
 * 
 * @param {object} allocation - { transport, hotel, food, activities }
 * @param {number} totalBudget - The total budget
 * @returns {object} Validation result
 */
export function validateTripAllocation(allocation, totalBudget) {
  const { transport = 0, hotel = 0, food = 0, activities = 0 } = allocation;
  const total = transport + hotel + food + activities;
  const remaining = totalBudget - total;

  return {
    transport,
    hotel,
    food,
    activities,
    total,
    budget: totalBudget,
    remaining,
    isExact: Math.abs(total - totalBudget) < 0.01,
    isUnder: total <= totalBudget,
    isOver: total > totalBudget,
    overBy: total > totalBudget ? total - totalBudget : 0
  };
}

// ─── Hidden Costs ─────────────────────────────────────────────────

/**
 * Standard hidden costs that can surprise travelers.
 */
export const HIDDEN_COSTS_MASTER = [
  { id: 'baggage-fee', name: 'Baggage Fee', amount: 35, tip: 'Pack light or use a carry-on!' },
  { id: 'travel-insurance', name: 'Travel Insurance', amount: 25, tip: 'Worth it for peace of mind.' },
  { id: 'currency-exchange', name: 'Currency Exchange Fee', amount: '3% of spending', tip: 'Check rates before you go.' },
  { id: 'resort-fee', name: 'Resort/Hotel Fees', amount: 20, per: 'night', tip: 'Always check the fine print.' },
  { id: 'tips-guide', name: 'Tips for Tour Guides', amount: 15, tip: 'Budget 10-15% for tips.' },
  { id: 'airport-snacks', name: 'Airport Snacks Markup', amount: 12, tip: 'Bring snacks from home!' }
];

/**
 * Generate random hidden costs for a given destination.
 * @param {string} destinationId 
 * @param {number} count - Number of hidden costs to generate
 * @returns {Array} Hidden cost items
 */
export function generateHiddenCosts(destinationId, count = 3) {
  const dest = DESTINATIONS.find(d => d.id === destinationId);
  const baseHidden = dest ? [...dest.hiddenCosts] : [];

  // Add random extras from master list
  const extras = HIDDEN_COSTS_MASTER
    .filter(hc => !baseHidden.find(b => b.name === hc.name))
    .sort(() => Math.random() - 0.5)
    .slice(0, count - baseHidden.length);

  return [...baseHidden, ...extras];
}

export default {
  DESTINATIONS,
  calculateTripCost,
  checkTripBudget,
  calculateVacationSavingsTimeline,
  splitTripCost,
  validateTripAllocation,
  HIDDEN_COSTS_MASTER,
  generateHiddenCosts
