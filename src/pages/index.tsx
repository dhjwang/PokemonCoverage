import PokemonCommand from "@/components/ui/PokemonCommand";
import { TierFilter } from "@/components/ui/TierFilter";
import { PokemonProvider } from "@/context/PokemonContext";
import { Resistances } from "@/components/ui/Resistances";
import { basePath } from "@/lib/constants";
import Head from "next/head";
export default function Home() {
  return (
    <>
      <Head>
        <title>Pokemon Team Coverage</title>
        <meta
          name="description"
          content="Select a tier/format, build a Pokemon team, and check for its type resistances"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#e8ebed" />
        <meta charSet="utf-8" />
        <link rel="icon" href={`${basePath}/pokeball.png`} />

        <meta property="og:title" content="Pokemon Team Coverage" />
        <meta
          property="og:description"
          content="Select a tier/format, build a Pokemon team, and check for its type resistances"
        />
        <meta
          property="og:image"
          content="https://dhjwang.github.io/PokemonCoverage/pokeball.png"
        />
        <meta
          property="og:url"
          content="https://dhjwang.github.io/PokemonCoverage/"
        />
        <meta property="og:type" content="website" />
      </Head>
      <main>
        <div className="container mx-auto py-4 px-3 sm:px-4 sm:py-6 max-w-200">
          <h1
            className="text-2xl sm:text-3xl font-bold text-yellow-300 drop-shadow-[0_1.2px_1.2px_rgba(0,0,255,1)]
       text-center mb-4 sm:mb-6 "
          >
            Pokemon Team Coverage
          </h1>
          <PokemonProvider>
            <TierFilter />
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <PokemonCommand id="1" />
              <PokemonCommand id="2" />
              <PokemonCommand id="3" />
              <PokemonCommand id="4" />
              <PokemonCommand id="5" />
              <PokemonCommand id="6" />
            </div>
            <Resistances />
          </PokemonProvider>
          <div className="text-center text-sm pt-4 text-secondary-foreground">
            Last Updated: 7/20/25
          </div>
        </div>
      </main>
    </>
  );
}
