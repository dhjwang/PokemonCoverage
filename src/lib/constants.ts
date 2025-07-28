export const baseTypes = `https://play.pokemonshowdown.com/sprites/types/`;
export const circleTypes = `https://raw.githubusercontent.com/msikma/pokesprite/master/misc/types/gen8/`;
export const miniSprites =
  "url(https://play.pokemonshowdown.com/sprites/pokemonicons-sheet.png?v19)";

const mainImage = "https://play.pokemonshowdown.com/sprites/home-centered/";
const candidateImage = "https://img.pokemondb.net/sprites/scarlet-violet/icon/";

export const abilityModifiers: Record<string, Record<string, number>> = {
  "Dry Skin": { Water: 0, Fire: 1.25 },
  "Earth Eater": { Ground: 0 },
  "Flash Fire": { Fire: 0 },
  Heatproof: { Fire: 0.5 },
  Levitate: { Ground: 0 },
  "Lightning Rod": { Electric: 0 },
  "Motor Drive": { Electric: 0 },
  "Purifying Salt": { Ghost: 0.5 },
  "Sap Sipper": { Grass: 0 },
  "Storm Drain": { Water: 0 },
  "Thick Fat": { Fire: 0.5, Ice: 0.5 },
  "Volt Absorb": { Electric: 0 },
  "Water Absorb": { Water: 0 },
  "Water Bubble": { Fire: 0.5 },
  "Well-Baked Body": { Fire: 0 },
  "Wonder Guard": {
    Water: 0,
    Electric: 0,
    Ice: 0,
    Psychic: 0,
    Dragon: 0,
    Steel: 0,
    Fairy: 0,
  },
};

export const allTiers = [
  "LC",
  "NFE",
  "ZU",
  "ZUBL",
  "PU",
  "PUBL",
  "NU",
  "NUBL",
  "RU",
  "RUBL",
  "UU",
  "UUBL",
  "OU",
  "Uber",
  "AG",
  "NatDex",
];

export const formats = [
  "NatDex",
  "AG",
  "Uber",
  "OU",
  "UU",
  "RU",
  "NU",
  "PU",
  "ZU",
  "NFE",
  "LC",
];
