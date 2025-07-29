import { createContext, useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction, ReactNode } from "react";

import type { Pokemon, TeamMember, TypeChart } from "@/types/types";
import { normalizePokedex } from "@/lib/utils";
import { allTiers, basePath } from "@/lib/constants";

type Props = {
  children: ReactNode;
};

type PokemonContextType = {
  pokedex: Record<string, Pokemon>;
  typeComboChart: TypeChart;
  tiersState: [string[], Dispatch<SetStateAction<string[]>>];
  teamState: [TeamMember[], Dispatch<SetStateAction<TeamMember[]>>];
};

export const PokemonContext = createContext<PokemonContextType>({
  pokedex: {},
  typeComboChart: {},
  tiersState: [[], () => {}],
  teamState: [[], () => {}],
});

export const PokemonProvider = ({ children }: Props) => {
  const pokedex = useRef<Record<string, Pokemon>>({});
  const [typeComboChart, setTypeComboChart] = useState<TypeChart>({});
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [tiers, setTiers] = useState<string[]>(allTiers);

  useEffect(() => {
    const getData = async () => {
      const [responsePokedex, responseTypeComboChart] = await Promise.all([
        fetch(`${basePath}/pokemon.json`),
        fetch(`${basePath}/typeChart.json`),
      ]);

      const rawPokedex: Record<string, Pokemon> = await responsePokedex.json();
      const rawTypeComboChart = await responseTypeComboChart.json();
      setTypeComboChart(rawTypeComboChart);
      pokedex.current = normalizePokedex(rawPokedex, rawTypeComboChart);
    };
    getData();
  }, []);

  return (
    <PokemonContext.Provider
      value={{
        pokedex: pokedex.current,
        typeComboChart: typeComboChart,
        tiersState: [tiers, setTiers],
        teamState: [team, setTeam],
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};
