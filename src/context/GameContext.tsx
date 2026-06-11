// src/context/GameContext.tsx
import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import { GameState } from "../types/game";
import { gameReducer, GameAction, INITIAL_STATE } from "../reducer/gameReducer";

const GameStateContext = createContext<GameState>(INITIAL_STATE);
const GameDispatchContext = createContext<Dispatch<GameAction>>(() => {});

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  return useContext(GameStateContext);
}

export function useGameDispatch() {
  return useContext(GameDispatchContext);
}
