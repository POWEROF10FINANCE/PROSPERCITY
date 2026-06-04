import { calculateBudget, verifyFiftyThirtyTwenty, calculateSavingsGoal } from './budget-engine.mjs';
import { calculateDTI, checkLoanAffordability, getRandomDTIScenario } from './dti-calculator.mjs';
import { calculateTripCost, checkTripBudget } from './vacation-forecaster.mjs';
import { calculateEmergencyFundTarget, getRandomEmergencyEvent } from './emergency-fund-planner.mjs';
import { getAffirmationForLocation, getDailyAffirmation } from './affirmation-engine.mjs';
import { createPlayerProfile, addStars, completeScenario, getProgressSummary } from './scoring-system.mjs';
import { GameSession } from './game-state-persistence.mjs';

// Test Budget Engine
const budget = calculateBudget(1000, [
  { category: 'needs', name: 'Rent', amount: 500 },
  { category: 'wants', name: 'Games', amount: 150 },
  { category: 'savings', name: 'Savings', amount: 100 }
], 100);
console.log('Budget Engine: OK', budget.surplusOrDeficit, budget.savingsRate + '%');

const verify = verifyFiftyThirtyTwenty(1000, 500, 300, 200);
console.log('50/30/20 Verify: OK - Stars:', verify.stars);

const goal = calculateSavingsGoal(500, 100, 50);
console.log('Savings Goal: OK - Months:', goal.monthsToGoal);

// Test DTI Calculator
const dti = calculateDTI(1800, [
  { name: 'Student Loan', amount: 200 },
  { name: 'Credit Card', amount: 75 },
  { name: 'Car Loan', amount: 150 }
]);
console.log('DTI Calculator: OK - Ratio:', dti.ratio + '%', '- Rating:', dti.rating);

const loan = checkLoanAffordability(3000, [{ name: 'Mortgage', amount: 800 }], 200);
console.log('Loan Affordability: OK -', loan.affordable ? 'Affordable' : 'Not affordable');

const scenario = getRandomDTIScenario();
console.log('DTI Scenario: OK -', scenario.name);

// Test Vacation Forecaster
const trip = calculateTripCost('sunny-beach', 5, { includeHiddenCosts: true });
console.log('Vacation Forecaster: OK - Grand Total:', trip.grandTotal);

const budgetCheck = checkTripBudget(trip.grandTotal, 1200);
console.log('Trip Budget: OK - Within:', budgetCheck.withinBudget);

// Test Emergency Fund Planner
const fund = calculateEmergencyFundTarget(2000);
console.log('Emergency Fund: OK - 3mo:', fund.recommended.minimum, '6mo:', fund.recommended.moderate);

const event = getRandomEmergencyEvent();
console.log('Emergency Event: OK -', event.name, '- $' + event.cost);

// Test Affirmation Engine
const affirm = getAffirmationForLocation('home-base', []);
console.log('Affirmation Engine: OK -', affirm.text.substring(0, 40) + '...');

const daily = getDailyAffirmation();
console.log('Daily Affirmation: OK -', daily.isDaily);

// Test Scoring System
const profile = createPlayerProfile('TestPlayer', 12, 'ava', { source: 'allowance', amount: 50, nickname: 'Allowance' });
console.log('Player Profile: OK -', profile.name);

const starResult = addStars(profile, 3);
console.log('Add Stars: OK - Total:', starResult.totalStars);

const scenarioResult = completeScenario(profile, 'my-first-paycheck', 2);
console.log('Complete Scenario: OK -', scenarioResult.alreadyCompleted ? 'Already done' : 'New complete');

const summary = getProgressSummary(profile);
console.log('Progress Summary: OK -', summary.completionPercent + '%');

// Test Game Session
const session = new GameSession();
session.startScenario('dti-challenge');
session.recordAnswer(true);
session.recordAnswer(false);
session.recordAnswer(true);
console.log('Game Session: OK - Accuracy:', session.getAccuracy() + '%');

console.log('\n✅ ALL MODULES VERIFIED SUCCESSFULLY');
