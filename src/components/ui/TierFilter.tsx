import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext } from "react";
import { PokemonContext } from "@/context/PokemonContext";
import { allTiers, formats } from "@/lib/constants";

export const TierFilter = () => {
  const {
    tiersState: [, setTiers],
  } = useContext(PokemonContext);

  return (
    <Tabs
      defaultValue="NatDex"
      className="flex items-center mb-4 sm:mb-6"
      onValueChange={(val) => {
        setTiers(allTiers.slice(0, allTiers.indexOf(val) + 1));
      }}
    >
      <TabsList className="bg-accent border">
        {formats.map((format) => (
          <TabsTrigger
            className="px-0.75 text-sm text-accent-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            key={format}
            value={format}
          >
            {format}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
