import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

const initialState = {
  playerName: '',
  playerAge: null,
  stars: 0,
  coins: 100,
  level: 1,
  onboardingStep: 0, // 0: Title, 1: ParentGate, 2: Avatar, 3: Info, 4: Money, 5: Game
  unlockedLocations: ['/game'],
  completedScenarios: [],
  currentScenario: null,
  transactions: [], // Real transaction data from bank upload
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_PLAYER_INFO':
      return { ...state, ...action.payload };
    case 'SET_ONBOARDING_STEP':
      return { ...state, onboardingStep: action.payload };
    case 'EARN_STARS':
      return { ...state, stars: state.stars + action.payload };
    case 'UNLOCK_LOCATION':
      if (state.unlockedLocations.includes(action.payload)) return state;
      return { ...state, unlockedLocations: [...state.unlockedLocations, action.payload] };
    case 'COMPLETE_SCENARIO':
      return { 
        ...state, 
        completedScenarios: [...state.completedScenarios, action.payload],
        stars: state.stars + 2 
      };
    case 'SET_SCENARIO':
      return { ...state, currentScenario: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'REHYDRATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('prospercity_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'REHYDRATE', payload: parsed });
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('prospercity_state', JSON.stringify(state));
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
