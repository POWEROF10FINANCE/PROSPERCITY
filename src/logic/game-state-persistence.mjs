/**
 * ProsperCity — Game State Persistence
 * 
 * Module for saving and loading player profiles, game progress,
 * and settings using localStorage (works in browser).
 * 
 * Falls back gracefully if localStorage is not available (SSR/Node).
 */

// ─── Storage Keys ────────────────────────────────────────────────

const STORAGE_KEYS = {
  PLAYER_PROFILE: 'prospercity_player_profile',
  GAME_SETTINGS: 'prospercity_game_settings',
  AFFIRMATION_HISTORY: 'prospercity_affirmation_history',
  LAST_SAVED: 'prospercity_last_saved',
  SAVE_SLOTS: 'prospercity_save_slots'
};

// ─── Storage Availability ────────────────────────────────────────

/**
 * Check if localStorage is available.
 * @returns {boolean}
 */
export function isStorageAvailable() {
  try {
    const testKey = '__prospercity_test__';
    if (typeof localStorage === 'undefined') return false;
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

// ─── Profile Save/Load ───────────────────────────────────────────

/**
 * Save a player profile to localStorage.
 * @param {object} profile - Player profile object
 * @param {string} slotId - Optional save slot ID
 * @returns {boolean} Success
 */
export function saveProfile(profile, slotId = 'default') {
  if (!isStorageAvailable()) {
    console.warn('ProsperCity: localStorage not available, cannot save profile');
    return false;
  }

  try {
    const payload = {
      ...profile,
      _savedAt: new Date().toISOString(),
      _version: 1
    };

    if (slotId === 'default') {
      localStorage.setItem(STORAGE_KEYS.PLAYER_PROFILE, JSON.stringify(payload));
    } else {
      // Multi-slot save
      const slots = getSaveSlots();
      slots[slotId] = payload;
      localStorage.setItem(STORAGE_KEYS.SAVE_SLOTS, JSON.stringify(slots));
    }

    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
    return true;
  } catch (e) {
    console.error('ProsperCity: Error saving profile:', e);
    return false;
  }
}

/**
 * Load a player profile from localStorage.
 * @param {string} slotId - Optional save slot ID
 * @returns {object|null} Profile or null if not found
 */
export function loadProfile(slotId = 'default') {
  if (!isStorageAvailable()) {
    console.warn('ProsperCity: localStorage not available, cannot load profile');
    return null;
  }

  try {
    let data;

    if (slotId === 'default') {
      const raw = localStorage.getItem(STORAGE_KEYS.PLAYER_PROFILE);
      data = raw ? JSON.parse(raw) : null;
    } else {
      const slots = getSaveSlots();
      data = slots[slotId] || null;
    }

    if (!data) return null;

    // Clean up internal fields
    const { _savedAt, _version, ...profile } = data;
    return profile;
  } catch (e) {
    console.error('ProsperCity: Error loading profile:', e);
    return null;
  }
}

/**
 * Delete a saved profile.
 * @param {string} slotId - Optional save slot ID
 * @returns {boolean} Success
 */
export function deleteProfile(slotId = 'default') {
  if (!isStorageAvailable()) return false;

  try {
    if (slotId === 'default') {
      localStorage.removeItem(STORAGE_KEYS.PLAYER_PROFILE);
    } else {
      const slots = getSaveSlots();
      delete slots[slotId];
      localStorage.setItem(STORAGE_KEYS.SAVE_SLOTS, JSON.stringify(slots));
    }
    return true;
  } catch (e) {
    console.error('ProsperCity: Error deleting profile:', e);
    return false;
  }
}

/**
 * Get all save slots with metadata.
 * @returns {object} Save slots object
 */
export function getSaveSlots() {
  if (!isStorageAvailable()) return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVE_SLOTS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * List all saved profiles with metadata.
 * @returns {Array<{slot: string, name: string, stars: number, savedAt: string}>}
 */
export function listSavedProfiles() {
  const profiles = [];

  // Default slot
  const defaultProfile = loadProfile('default');
  if (defaultProfile) {
    profiles.push({
      slot: 'default',
      name: defaultProfile.name,
      stars: defaultProfile.stars,
      savedAt: getLastSavedTime()
    });
  }

  // Named slots
  const slots = getSaveSlots();
  for (const [slotId, data] of Object.entries(slots)) {
    profiles.push({
      slot: slotId,
      name: data.name || 'Unknown',
      stars: data.stars || 0,
      savedAt: data._savedAt || null
    });
  }

  return profiles;
}

// ─── Game Settings ───────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  musicVolume: 0.7,
  sfxVolume: 0.8,
  typewriterSpeed: 30,
  animationsEnabled: true,
  darkMode: false,
  language: 'en',
  fontSize: 'medium'
};

/**
 * Save game settings.
 * @param {object} settings - Partial settings object
 * @returns {boolean} Success
 */
export function saveSettings(settings = {}) {
  if (!isStorageAvailable()) return false;

  try {
    const current = loadSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.GAME_SETTINGS, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('ProsperCity: Error saving settings:', e);
    return false;
  }
}

/**
 * Load game settings.
 * @returns {object} Settings (merged with defaults)
 */
export function loadSettings() {
  if (!isStorageAvailable()) return { ...DEFAULT_SETTINGS };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAME_SETTINGS);
    const saved = raw ? JSON.parse(raw) : {};
    return { ...DEFAULT_SETTINGS, ...saved };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

// ─── Affirmation History ─────────────────────────────────────────

/**
 * Save which affirmations have been shown to the player.
 * @param {Array<string>} affirmationIds - Array of shown affirmation IDs
 * @returns {boolean} Success
 */
export function saveAffirmationHistory(affirmationIds = []) {
  if (!isStorageAvailable()) return false;

  try {
    localStorage.setItem(
      STORAGE_KEYS.AFFIRMATION_HISTORY,
      JSON.stringify({
        ids: affirmationIds,
        updatedAt: new Date().toISOString()
      })
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Load affirmation history.
 * @returns {Array<string>} Array of shown affirmation IDs
 */
export function loadAffirmationHistory() {
  if (!isStorageAvailable()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AFFIRMATION_HISTORY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data.ids) ? data.ids : [];
  } catch {
    return [];
  }
}

// ─── Utility Functions ───────────────────────────────────────────

/**
 * Get the timestamp of the last save.
 * @returns {string|null} ISO date string or null
 */
export function getLastSavedTime() {
  if (!isStorageAvailable()) return null;
  return localStorage.getItem(STORAGE_KEYS.LAST_SAVED) || null;
}

/**
 * Get storage usage info.
 * @returns {object} Storage usage stats
 */
export function getStorageInfo() {
  if (!isStorageAvailable()) {
    return { available: false, usedBytes: 0, remaining: 0 };
  }

  let usedBytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('prospercity_')) {
      const value = localStorage.getItem(key);
      usedBytes += (key.length + (value ? value.length : 0)) * 2; // UTF-16
    }
  }

  return {
    available: true,
    usedBytes,
    usedKB: Math.round(usedBytes / 1024 * 10) / 10,
    remaining: null, // Browsers don't expose this reliably
    profileExists: !!localStorage.getItem(STORAGE_KEYS.PLAYER_PROFILE)
  };
}

/**
 * Export all game data as a JSON string (for backup/transfer).
 * @returns {string|null} JSON string or null
 */
export function exportAllData() {
  if (!isStorageAvailable()) return null;

  try {
    const data = {};
    for (const key of Object.values(STORAGE_KEYS)) {
      const value = localStorage.getItem(key);
      if (value) data[key] = JSON.parse(value);
    }
    return JSON.stringify(data, null, 2);
  } catch (e) {
    console.error('ProsperCity: Error exporting data:', e);
    return null;
  }
}

/**
 * Import all game data from a JSON string.
 * @param {string} jsonString - Previously exported data
 * @returns {boolean} Success
 */
export function importAllData(jsonString) {
  if (!isStorageAvailable()) return false;

  try {
    const data = JSON.parse(jsonString);
    for (const [key, value] of Object.entries(data)) {
      if (Object.values(STORAGE_KEYS).includes(key)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
    return true;
  } catch (e) {
    console.error('ProsperCity: Error importing data:', e);
    return false;
  }
}

/**
 * Clear all ProsperCity data from localStorage.
 * @returns {boolean} Success
 */
export function clearAllData() {
  if (!isStorageAvailable()) return false;

  try {
    for (const key of Object.values(STORAGE_KEYS)) {
      localStorage.removeItem(key);
    }
    return true;
  } catch {
    return false;
  }
}

// ─── Session State (non-persistent, in-memory only) ──────────────

/**
 * Create an in-memory game session state.
 * Useful for tracking current-session-only data.
 */
export class GameSession {
  constructor() {
    this.startTime = Date.now();
    this.currentScenario = null;
    this.currentLocation = null;
    this.scenarioStartTime = null;
    this.answeredCorrectly = 0;
    this.attemptedQuestions = 0;
    this.npcDialogState = {};
    this.tempData = {};
  }

  /** Start a new scenario attempt. */
  startScenario(scenarioId) {
    this.currentScenario = scenarioId;
    this.scenarioStartTime = Date.now();
    this.answeredCorrectly = 0;
    this.attemptedQuestions = 0;
  }

  /** Record an answer attempt. */
  recordAnswer(correct) {
    this.attemptedQuestions++;
    if (correct) this.answeredCorrectly++;
  }

  /** Get accuracy for current session. */
  getAccuracy() {
    if (this.attemptedQuestions === 0) return 0;
    return Math.round((this.answeredCorrectly / this.attemptedQuestions) * 100);
  }

  /** Get session elapsed time in seconds. */
  getElapsedSeconds() {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /** Get scenario elapsed time in seconds. */
  getScenarioElapsedSeconds() {
    if (!this.scenarioStartTime) return 0;
    return Math.floor((Date.now() - this.scenarioStartTime) / 1000);
  }

  /** Reset session. */
  reset() {
    this.startTime = Date.now();
    this.currentScenario = null;
    this.currentLocation = null;
    this.scenarioStartTime = null;
    this.answeredCorrectly = 0;
    this.attemptedQuestions = 0;
    this.npcDialogState = {};
    this.tempData = {};
  }
}

export default {
  saveProfile,
  loadProfile,
  deleteProfile,
  listSavedProfiles,
  saveSettings,
  loadSettings,
  saveAffirmationHistory,
  loadAffirmationHistory,
  getLastSavedTime,
  getStorageInfo,
  exportAllData,
  importAllData,
  clearAllData,
  isStorageAvailable,
  GameSession,
  STORAGE_KEYS
