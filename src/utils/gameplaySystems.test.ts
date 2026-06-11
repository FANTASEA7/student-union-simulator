import {
  applyClimateDeltas,
  calculateActivityClimateDelta,
  calculateWeeklyCombos,
  getDefaultCampusClimate,
} from "./gameplaySystems.js";
import type { ActivityDef, CampusClimate } from "../types/game.js";

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Expected ${String(expected)}, got ${String(actual)}`);
  }
}

function assertDeepEqual(actual: unknown, expected: unknown): void {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(`Expected ${expectedJson}, got ${actualJson}`);
  }
}

function activity(type: ActivityDef["type"], label = type): ActivityDef {
  return {
    type,
    subType: `${type}_test` as ActivityDef["subType"],
    label,
    icon: "*",
    description: label,
    rarity: "common",
    apCost: 1,
    energyCost: 10,
    statEffects: [],
    stressDelta: 0,
    eventTriggerChance: 0,
  };
}

const balancedWeek = [
  activity("study"),
  activity("work"),
  activity("social"),
  activity("rest"),
  activity("volunteer"),
];

const combos = calculateWeeklyCombos(balancedWeek);
assertEqual(combos.length, 1);
assertEqual(combos[0].id, "balanced_week");
assertDeepEqual(combos[0].statEffects, [
  { stat: "organization", delta: 3 },
  { stat: "academics", delta: 3 },
  { stat: "stress", delta: 6 },
]);
assertDeepEqual(combos[0].climateEffects, {
  publicTrust: 4,
  schoolPressure: -3,
  clubSatisfaction: 4,
  publicOpinion: 2,
});

const crunchWeek = [
  activity("work"),
  activity("work"),
  activity("work"),
  activity("study"),
  activity("rest"),
];
assertEqual(calculateWeeklyCombos(crunchWeek)[0].id, "work_sprint");

const climate = getDefaultCampusClimate();
const changed = applyClimateDeltas(climate, {
  publicTrust: 80,
  schoolPressure: -90,
  clubSatisfaction: 7,
  publicOpinion: -8,
});
assertDeepEqual(changed, {
  publicTrust: 100,
  schoolPressure: 0,
  clubSatisfaction: 57,
  publicOpinion: 42,
});

const activityDelta = calculateActivityClimateDelta(activity("work"), [
  { stat: "organization", delta: 6 },
  { stat: "budget", delta: 3 },
]);
assertDeepEqual(activityDelta, {
  publicTrust: 1,
  schoolPressure: 2,
  clubSatisfaction: 0,
  publicOpinion: 0,
});

const badClimate: CampusClimate = {
  publicTrust: 20,
  schoolPressure: 86,
  clubSatisfaction: 22,
  publicOpinion: 18,
};
assertEqual(applyClimateDeltas(badClimate, {}).dominantMood, "crisis");
