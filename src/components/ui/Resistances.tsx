import { PokemonContext } from "@/context/PokemonContext";
import { useContext, useEffect, useState, useMemo } from "react";
import { Candidates } from "./Candidates";
import { Suggestion } from "@/types/types";
import { countCurrentResistances, getTypeComboSuggestions } from "@/lib/utils";
import { circleTypes } from "@/lib/constants";

export const Resistances = () => {
  const {
    teamState: [team],
    tiersState: [tiers],
    pokedex: pokedex,
    typeComboChart: typeComboChart,
  } = useContext(PokemonContext);

  const [resistances, setResistances] = useState<Record<string, number>>({});
  const [suggested, setSuggested] = useState<Suggestion[]>([]);
  const baseTypeChart = useMemo(() => {
    return Object.fromEntries(
      Object.entries(typeComboChart).filter(([key]) => !key.includes(","))
    );
  }, [typeComboChart]);

  useEffect(() => {
    if (!Object.keys(typeComboChart).length) return;
    setSuggested([]);

    const activeTeam = team.filter((member) => !member.isBenched);

    if (activeTeam.length === 0) {
      setResistances(
        Object.fromEntries(Object.keys(baseTypeChart).map((key) => [key, 0]))
      );
      return;
    }

    const calcResitances = countCurrentResistances(activeTeam, pokedex);
    setResistances(calcResitances);

    if (
      team.length < 6 &&
      Object.values(calcResitances).some((type) => type === 0)
    ) {
      setSuggested(
        getTypeComboSuggestions(
          baseTypeChart,
          typeComboChart,
          calcResitances,
          pokedex,
          tiers
        )
      );
    }
  }, [team, tiers, typeComboChart]);

  return (
    <div className="flex flex-col h-48 border justify-between bg-card rounded-md mt-4 sm:mt-6">
      <div className=" h-[140px] rounded-t-md bg-primary/50 ">
        {suggested.length ? (
          <Candidates suggestedTypeCombos={suggested} />
        ) : (
          <div className="flex flex-col items-left text-sm text-card-foreground h-full px-5 py-3 opacity-25">
            {team.length > 5 ? (
              <span className="font-bold">Team is Full.</span>
            ) : (
              <span>Search Pokemon to form a Team.</span>
            )}

            <span>Click the Header to set another Pokemon.</span>
            <span>Click the Body to bench Pokemon.</span>
            <span>Select from the Recommendations.</span>
            {!Object.values(resistances).some((type) => type === 0) &&
            Object.keys(typeComboChart).length !== 0 ? (
              <span className="font-bold">Team can resist all Types.</span>
            ) : (
              <span>See what Types your team Resists.</span>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center h-13 py-2 bg-card rounded-b-md">
        {Object.keys(typeComboChart).length === 0 ? (
          <div></div>
        ) : (
          Object.entries(resistances).map(([key, amount]) => (
            <div
              key={key}
              title={`${key}: ${amount} resist${amount !== 1 ? "s" : ""}`}
            >
              <img
                className={` transition object-contain h-7 w-auto
                    ${amount > 0 ? "" : "opacity-25"}`}
                src={`${circleTypes + key.toLowerCase()}.png`}
                alt={key}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
