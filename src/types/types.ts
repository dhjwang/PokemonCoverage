export type Pokemon = {
  num: number;
  name: string;
  types: string[];
  abilities: string[];
  bst: number;
  tier: string;
  imageS: string;
  imageL: string;
  image: string;
  resistances: Record<string, number>;
};
export type TypeChart = Record<string, Record<string, number>>;

export type TeamMember = {
  keyName: string;
  types: string[];
  abilities: string[];
  id: string;
  isBenched: boolean;
};

export type Suggestion = {
  typeCombo: string;
  newResistedTypes: string[];
  score: number;
  hasDuplicate?: boolean;
};
