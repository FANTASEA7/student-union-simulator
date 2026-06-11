// src/utils/eventPicker.ts
import { GameEvent, GameState } from "../types/game";
import { EVENTS } from "../data/events";
import { VOLUNTEER_EVENTS } from "../data/volunteers";

const ALL_EVENTS = [...EVENTS, ...VOLUNTEER_EVENTS];

export function pickEvent(state: GameState): GameEvent | null {
  const { stage, department, stats, eventHistory, flags } = state;

  const candidates = ALL_EVENTS.filter((event) => {
    if (!event.stage.includes(stage)) return false;
    if (eventHistory.includes(event.id)) return false;
    if (event.department && event.department !== department) return false;
    if (event.condition) {
      if (event.condition.minStats) {
        for (const [key, val] of Object.entries(event.condition.minStats)) {
          if ((stats as any)[key] < val!) return false;
        }
      }
      if (event.condition.maxStats) {
        for (const [key, val] of Object.entries(event.condition.maxStats)) {
          if ((stats as any)[key] > val!) return false;
        }
      }
      if (event.condition.requiredFlags) {
        for (const f of event.condition.requiredFlags) {
          if (!flags[f]) return false;
        }
      }
      if (event.condition.excludeFlags) {
        for (const f of event.condition.excludeFlags) {
          if (flags[f]) return false;
        }
      }
      if (event.condition.hasLover !== undefined) {
        if (event.condition.hasLover && !state.datingNPCId) return false;
        if (!event.condition.hasLover && state.datingNPCId) return false;
      }
    }
    return true;
  });

  if (candidates.length === 0) return null;

  const weighted = candidates.flatMap((e) => Array(e.priority).fill(e));
  return weighted[Math.floor(Math.random() * weighted.length)];
}
