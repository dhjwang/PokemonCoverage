# Pokemon Team Builder

A modern, interactive Pokemon team builder built with **Next.js**. Search for Pokemon by name, filter by tier, view team type resistances, and get smart suggestions to complete your team.

- Input a Pokemon team to find out which types the team resist.
- If the given team resists all types, no recommendation will be given.
- If less than 6 Pokemon are given, recommendations will be generated.
- Pokemon from a lower tier can be used in higher tiers.
- Recommendations are based off which type combination would provide the team with the most unique resistances and chooses Pokemon with higher total base stat.

You can check it out here: [https://dhjwang.github.io/PokemonCoverage/](https://dhjwang.github.io/PokemonCoverage/)

## Features

- Search and filter Pokemon from the full Pokedex **up to Scarlet/Violet**
- Filter by competitive **tiers** (from Smogon)
- View **resistances** from all types based on team composition
- **Abilities are also taken into account** (Water Absorb, Flash Fire, etc.)
- Intelligent **suggestions** based on current team weaknesses
- **Bench** Pokemon dynamically (useful for VGC where you can only choose 4 of the 6 members)

_Data Last updated: 7/20/25 (from [Pokemon Showdown Pokedex](https://github.com/smogon/pokemon-showdown))_
