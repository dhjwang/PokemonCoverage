import { PokemonContext } from "@/context/PokemonContext";
import { useContext, useState } from "react";
import { abilityModifiers, baseTypes, circleTypes } from "@/lib/constants";
import { Pokemon } from "@/types/types";

type PokemonCardProps = {
  pokemon: Pokemon;
  id: string;
  removePokemon: () => void;
};

export default function PokemonCard({
  pokemon,
  id,
  removePokemon,
}: PokemonCardProps) {
  const {
    tiersState: [tiers],
    teamState: [, setTeam],
  } = useContext(PokemonContext);

  const [isBenched, setIsBenched] = useState(false);

  const handleBench = () => {
    if (isBenched) {
      setTeam((prevTeam) =>
        prevTeam.map((member) =>
          member.id === id ? { ...member, isBenched: false } : member
        )
      );
      setIsBenched(false);
    } else {
      setTeam((prevTeam) =>
        prevTeam.map((member) =>
          member.id === id ? { ...member, isBenched: true } : member
        )
      );
      setIsBenched(true);
    }
  };

  return (
    <div
      className={`flex flex-col h-full rounded-md transition bg-secondary ${
        !tiers.includes(pokemon.tier) ? " border-red-500" : ""
      }
              ${isBenched ? "border-gray-400 grayscale opacity-70" : ""}`}
    >
      <div
        className={`h-9 flex items-center justify-between  ${
          !tiers.includes(pokemon.tier)
            ? " bg-accent text-accent-foreground"
            : "bg-primary text-primary-foreground"
        } rounded-t-md px-2 cursor-pointer text-sm border-b`}
        onClick={removePokemon}
      >
        <div className="truncate text-center flex-1">{pokemon.name}</div>
        <span
          className={`rounded-full font-semibold px-2 ${
            !tiers.includes(pokemon.tier)
              ? "bg-primary text-primary-foreground/80"
              : " bg-accent text-accent-foreground"
          }`}
        >
          {pokemon.tier}
        </span>
      </div>
      <div
        className="flex-grow flex items-center justify-evenly overflow-hidden p-2"
        onClick={handleBench}
      >
        <div className="flex flex-col items-center">
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className=" h-30 w-30 object-contain"
          />
          <div className="flex">
            {pokemon.types.map((type) => (
              <img
                key={type}
                src={`${baseTypes + type}.png`}
                alt={type}
                className="h-3.5"
              />
            ))}
            {pokemon.abilities[0] in abilityModifiers ? (
              <div
                className="ml-1 flex items-center text-[9px] overflow-hidden text-white rounded-sm px-1
                     border-[rgb(62,89,80)]  bg-[rgb(108,155,140)]"
              >
                {pokemon.abilities[0].replace(/[ -]/g, "").slice(0, 7)}
              </div>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-2 grid-rows-9 gap-0 ">
          {Object.keys(pokemon.resistances).map((type) => (
            <img
              key={type}
              className={`h-4 w-4 object-contain
                    ${pokemon.resistances[type] > 0 ? "" : "opacity-20"}`}
              src={`${circleTypes + type.toLowerCase()}.png`}
              alt={type}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
