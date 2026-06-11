// src/utils/saveLoad.ts
import { GameState, SaveData, PersistentData } from "../types/game";

const SAVE_PREFIX = "student_union_save_";
const PERSISTENT_KEY = "student_union_persistent";

export function saveGame(state: GameState, slot: number): boolean {
  try {
    const data: SaveData = {
      version: 1,
      timestamp: Date.now(),
      state,
    };
    localStorage.setItem(SAVE_PREFIX + slot, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function loadGame(slot: number): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_PREFIX + slot);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

export function deleteSave(slot: number): void {
  localStorage.removeItem(SAVE_PREFIX + slot);
}

export function getSaveSlots(): { slot: number; data: SaveData | null }[] {
  return [1, 2, 3].map((slot) => ({
    slot,
    data: loadGame(slot),
  }));
}

// Persistent data for NG+ (cross-save)
export function loadPersistentData(): PersistentData {
  try {
    const raw = localStorage.getItem(PERSISTENT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted data, reset
  }
  return {
    previousEndings: [],
    unlockedAchievements: [],
    unlockedHiddenContent: [],
    memoirUnlocked: false,
  };
}

export function savePersistentData(data: PersistentData): void {
  localStorage.setItem(PERSISTENT_KEY, JSON.stringify(data));
}
