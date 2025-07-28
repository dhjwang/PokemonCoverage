import { useContext, useState, useEffect, useMemo } from "react";
import { PokemonContext } from "@/context/PokemonContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suggestion, Pokemon } from "@/types/types";
import { baseTypes } from "@/lib/constants";
import { getValidPokemonForTier } from "@/lib/utils";
type CandidatesProps = {
  suggestedTypeCombos: Suggestion[];
};
export const Candidates = ({ suggestedTypeCombos }: CandidatesProps) => {
  const {
    teamState: [team, setTeam],
    pokedex: pokedex,
    tiersState: [tiers],
  } = useContext(PokemonContext);
  const [selectedTypeCombo, setSelectedTypeCombo] = useState("");

  useEffect(() => {
    setSelectedTypeCombo(suggestedTypeCombos[0].typeCombo);
  }, [suggestedTypeCombos]);

  const getCandidates = useMemo(() => {
    const topN = 5;
    const candidatesTypeMap: Record<string, [string, Pokemon][]> = {};

    for (const currentTypeCombo of suggestedTypeCombos) {
      const { typeCombo, hasDuplicate } = currentTypeCombo;
      const typeList = typeCombo.split(",");

      candidatesTypeMap[typeCombo] = getValidPokemonForTier(
        pokedex,
        tiers,
        typeList,
        hasDuplicate
      )
        .sort(([, monA], [, monB]) => monB.bst - monA.bst)
        .slice(0, topN);
    }
    return candidatesTypeMap;
  }, [suggestedTypeCombos]);

  const getAvailableId = () => {
    const usedIds = new Set(team.map((mon) => mon.id));
    for (let i = 1; i <= 6; i++) {
      if (!usedIds.has(String(i))) {
        return String(i);
      }
    }
    return null;
  };
  return (
    <Tabs
      value={selectedTypeCombo}
      className="flex items-center justify-center h-full"
      onValueChange={setSelectedTypeCombo}
    >
      {suggestedTypeCombos.map(({ typeCombo }) => (
        <TabsContent
          className="flex justify-evenly items-center w-full "
          key={typeCombo}
          value={typeCombo}
        >
          {getCandidates[typeCombo].map(([name, mon]) => (
            <img
              src={mon.imageL}
              key={name}
              alt={name}
              className="w-16 aspect-square object-contain border-b border-secondary-foreground"
              onClick={() =>
                setTeam([
                  ...team,
                  {
                    keyName: name,
                    types: mon.types,
                    abilities: mon.abilities,
                    id: getAvailableId()!,
                    isBenched: false,
                  },
                ])
              }
            />
          ))}
        </TabsContent>
      ))}
      <div className="h-14 w-full bg-card-foreground rounded-none flex justify-center">
        <TabsList className="h-14 bg-secondary rounded-sm">
          {suggestedTypeCombos.map(({ typeCombo, hasDuplicate, score }) => (
            <TabsTrigger
              className="px-1 flex-0 relative data-[state=active]:bg-accent data-[state=active]:border-accent-foreground bg-secondary rounded-sm"
              key={typeCombo}
              value={typeCombo}
            >
              <div className="flex flex-col items-center justify-around w-8">
                <div className="flex flex-col items-center justify-end h-7">
                  {(hasDuplicate
                    ? typeCombo.split(",").slice(0, -1)
                    : typeCombo.split(",")
                  ).map((eachType) => (
                    <img
                      key={eachType}
                      src={`${baseTypes + eachType}.png`}
                      alt={eachType}
                    />
                  ))}
                </div>
                <div
                  className={`text-[9px] w-8 overflow-hidden text-white ${
                    hasDuplicate
                      ? "border-[rgb(62,89,80)] border  bg-[rgb(108,155,140)]"
                      : ""
                  }`}
                >
                  {hasDuplicate
                    ? typeCombo
                        .split(",")
                        .slice(-1)[0]
                        .replace(/[ -]/g, "")
                        .slice(0, 7)
                    : ""}
                  &nbsp;
                </div>
              </div>
              <div className="absolute -bottom-3 border-card border-2 w-6 py-0.2 bg-primary text-primary-foreground text-[9px] rounded-full">
                +{score}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
};
