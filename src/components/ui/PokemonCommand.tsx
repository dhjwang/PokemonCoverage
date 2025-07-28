import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState, useMemo, useRef, useContext } from "react";
import { PokemonContext } from "@/context/PokemonContext";
import { Pokemon } from "@/types/types";
import PokemonCard from "./PokemonCard";
import { baseTypes, miniSprites } from "@/lib/constants";

export default function PokemonCommand({ id }: { id: string }) {
  const {
    pokedex: pokedex,
    tiersState: [tiers],
    teamState: [team, setTeam],
  } = useContext(PokemonContext);
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const removePokemon = () => {
    setPokemon(null);
    setTeam(team.filter((mon) => mon.id !== id));
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const addPokemon = (pokemon: Pokemon) => {
    setPokemon(pokemon);
    setQuery("");
  };

  const filterPokemon = useMemo(() => {
    if (query.length < 1) {
      return {};
    }
    const lower = query.toLowerCase();
    const filtered = Object.entries(pokedex).filter(([, mon]) =>
      mon.name
        .toLowerCase()
        .split(/[- ]/)
        .some(
          (segment) => segment.startsWith(lower) && tiers.includes(mon.tier)
        )
    );
    return Object.fromEntries(filtered);
  }, [query, tiers]);

  useEffect(() => {
    if (!pokemon) {
      const newName = team.find((mon) => mon.id === id)?.keyName;
      if (newName) {
        addPokemon(pokedex[newName]);
      }
    }
  }, [team]);

  return (
    <div className="h-48 w-full border rounded-md bg-card flex flex-col ">
      {!pokemon ? (
        <Command
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url('pokeball.png')",
          }}
          className="bg-[center_70%] bg-[length:100px_100px] bg-no-repeat"
        >
          <CommandInput
            ref={inputRef}
            value={query}
            onValueChange={setQuery}
            placeholder="Search Pokemon..."
          />
          {query.length > 0 && (
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {Object.entries(filterPokemon).map(([key, mon]) => (
                <CommandItem
                  key={key}
                  value={mon.name}
                  onSelect={() => {
                    addPokemon(mon);
                    setTeam([
                      ...team,
                      {
                        keyName: key,
                        types: mon.types,
                        abilities: mon.abilities,
                        id,
                        isBenched: false,
                      },
                    ]);
                  }}
                  className="flex items-center h-11 max-sm:gap-0 bg-card"
                >
                  <div
                    style={{
                      width: "40px",
                      height: "30px",
                      backgroundImage: miniSprites,
                      backgroundPosition: mon.imageS.split("scroll")[1].trim(),
                      backgroundRepeat: "no-repeat",
                      backgroundColor: "transparent",
                    }}
                  />
                  <div className="flex-1 text-xs line-clamp-2 ">{mon.name}</div>
                  <div className="flex flex-col">
                    {mon.types.map((type) => (
                      <img
                        key={type}
                        src={`${baseTypes + type}.png`}
                        alt={type}
                      />
                    ))}
                  </div>
                </CommandItem>
              ))}
            </CommandList>
          )}
        </Command>
      ) : (
        <PokemonCard pokemon={pokemon!} id={id} removePokemon={removePokemon} />
      )}
    </div>
  );
}
