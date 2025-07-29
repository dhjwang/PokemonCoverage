import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Pokemon, TypeChart, TeamMember, Suggestion } from "@/types/types";
import { abilityModifiers } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const normalizeTypeCombo = (types: string[], typeComboChart: TypeChart) => {
  const typeKey = types.join(",");
  return !typeComboChart[typeKey] ? types.slice().reverse().join(",") : typeKey;
};
const areEqual = (arr1: string[], arr2: string[]) => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  if (set1.size !== set2.size) return false;
  for (const item of set1) {
    if (!set2.has(item)) return false;
  }
  return true;
};

const calculateResistances = (
  types: string[],
  typeComboChart: TypeChart,
  ability?: string
): Record<string, number> => {
  const baseTypeCombo = {
    ...typeComboChart[normalizeTypeCombo(types, typeComboChart)],
  };
  const result: Record<string, number> = {};
  for (const type in baseTypeCombo) {
    let damageReceived = baseTypeCombo[type];
    if (ability && abilityModifiers[ability]?.[type] !== undefined) {
      damageReceived *= abilityModifiers[ability][type];
    }
    result[type] = damageReceived < 1 ? 1 : 0;
  }
  return result;
};

export const countCurrentResistances = (
  team: TeamMember[],
  pokedex: Record<string, Pokemon>
) => {
  const result: Record<string, number> = {};
  for (const mon of team) {
    for (const type of Object.keys(pokedex[mon.keyName].resistances)) {
      result[type] =
        (result[type] || 0) + pokedex[mon.keyName].resistances[type];
    }
  }
  return result;
};

export const getTypeComboSuggestions = (
  typeChart: TypeChart,
  allCombos: TypeChart,
  currentResistances: Record<string, number>,
  pokedex: Record<string, Pokemon>,
  tiers: string[],
  topN = 8
): Suggestion[] => {
  const typesNeeded = Object.keys(currentResistances).filter(
    (type) => currentResistances[type] < 1
  );
  const bucketScoreMap = new Map<number, Suggestion[]>();

  const addToBucket = (score: number, typeComboCandidate: Suggestion) => {
    if (!bucketScoreMap.has(score)) {
      bucketScoreMap.set(score, []);
    }
    bucketScoreMap.get(score)!.push(typeComboCandidate);
  };

  for (const typeCombo in allCombos) {
    const resistedTypes = Object.keys(typeChart).filter(
      (type) => allCombos[typeCombo][type] < 1
    );
    const newResistedTypes = resistedTypes.filter((type) =>
      typesNeeded.includes(type)
    );
    const score = newResistedTypes.length;

    const hasValidPokemon = Object.values(pokedex).some(
      (mon) =>
        areEqual(mon.types, typeCombo.split(",")) && tiers.includes(mon.tier)
    );
    if (hasValidPokemon) {
      addToBucket(score, { typeCombo, newResistedTypes, score });
    }
  }
  Object.values(pokedex)
    .filter(({ abilities }) => {
      return abilities[0] in abilityModifiers;
    })
    .forEach(({ resistances, tier, types, abilities }) => {
      const newResistedTypes = Object.entries(resistances)
        .filter(([type, value]) => {
          return typesNeeded.includes(type) && value > 0;
        })
        .map(([type]) => type);
      const score = newResistedTypes.length;

      const typeKey = normalizeTypeCombo(types, allCombos);

      const alreadyInBucket = (bucketScoreMap.get(score) || []).some(
        ({ typeCombo }) =>
          typeCombo === `${typeKey},${abilities[0]}` ||
          areEqual(typeCombo.split(","), types)
      );

      if (tiers.includes(tier) && !alreadyInBucket) {
        addToBucket(score, {
          typeCombo: `${typeKey},${abilities[0]}`,
          newResistedTypes,
          score,
          hasDuplicate: true,
        });
      }
    });

  const sortedScores = [...bucketScoreMap.keys()].sort((a, b) => b - a);

  let firstBucket = bucketScoreMap.get(sortedScores[0]);
  if (firstBucket!.length > topN) {
    firstBucket = firstBucket!
      .map((suggestedTypeCombo) => {
        const monTypeList = suggestedTypeCombo.typeCombo.split(",");
        const topPokemonForTypeCombo = Object.values(pokedex)
          .filter((mon) =>
            suggestedTypeCombo.hasDuplicate
              ? areEqual(mon.types, monTypeList.slice(0, -1)) &&
                tiers.includes(mon.tier) &&
                mon.abilities[0] === monTypeList.at(-1)
              : areEqual(mon.types, monTypeList) && tiers.includes(mon.tier)
          )
          .reduce((best, currentMon) =>
            best.bst < currentMon.bst ? currentMon : best
          );
        return { ...suggestedTypeCombo, bst: topPokemonForTypeCombo.bst };
      })
      .sort((a, b) => b.bst - a.bst);
  }

  const typeComboSuggestions = firstBucket!.slice(0, topN);
  for (const score of sortedScores.slice(1)) {
    const bucket = bucketScoreMap.get(score)!;
    if (typeComboSuggestions.length + bucket.length > topN) {
      break;
    } else typeComboSuggestions.push(...bucket);
  }
  return typeComboSuggestions;
};

export const getValidPokemonForTier = (
  pokedex: Record<string, Pokemon>,
  tiers: string[],
  typeList: string[],
  hasDuplicate: boolean = false
) => {
  return Object.entries(pokedex).filter(([name, mon]) => {
    if (!tiers.includes(mon.tier)) return false;

    if (hasDuplicate) {
      const typeAbility = typeList.at(-1);
      return (
        areEqual(mon.types, typeList.slice(0, -1)) &&
        mon.abilities[0] === typeAbility
      );
    } else {
      return (
        areEqual(mon.types, typeList) &&
        !Object.keys(abilityModifiers).some(
          (ability) =>
            ability.toLowerCase().replaceAll(" ", "") === name.split("-").at(-1)
        )
      );
    }
  });
};

export const normalizePokedex = (
  rawPokedex: Record<string, Pokemon>,
  rawTypeComboChart: TypeChart
) => {
  const newPokedex: Record<string, Pokemon> = {};
  for (const [name, mon] of Object.entries(rawPokedex)) {
    const hasTypeAbility = mon.abilities.some(
      (ability) => ability in abilityModifiers
    );

    if (mon.abilities.length > 1 && hasTypeAbility) {
      const typeAbilities: string[] = [];
      const otherAbilities: string[] = [];
      for (const ability of mon.abilities) {
        (ability in abilityModifiers ? typeAbilities : otherAbilities).push(
          ability
        );
      }
      newPokedex[name] = {
        ...mon,
        abilities: otherAbilities,
        resistances: calculateResistances(mon.types, rawTypeComboChart),
      };
      for (const ability of typeAbilities) {
        newPokedex[`${name}-${ability.toLowerCase().replaceAll(" ", "")}`] = {
          ...mon,
          name: `${mon.name}-${ability.replaceAll(" ", "")}`,
          abilities: [ability],
          resistances: calculateResistances(
            mon.types,
            rawTypeComboChart,
            ability
          ),
        };
      }
    } else if (mon.abilities[0] in abilityModifiers) {
      newPokedex[name] = {
        ...mon,
        resistances: calculateResistances(
          mon.types,
          rawTypeComboChart,
          mon.abilities[0]
        ),
      };
    } else {
      newPokedex[name] = {
        ...mon,
        resistances: calculateResistances(mon.types, rawTypeComboChart),
      };
    }
  }
  return newPokedex;
};
