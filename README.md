# Arena Lab

Arenas for Marvel Nemesis ports.<br />
Runs at [nemesismods.com/arena](https://nemesismods.com/arena).

Original code by sXe_Wolverine on Discord. Provided to EsotericEngineer to publish.

## Arenas

For now, Arena Lab keeps a list of ready-made `.imperfectarena` files. Building arenas here is the long-term plan.

How it works:

1. Add up to 17 `.imperfectarena` files. Each one is named from its manifest, or from its file name if the manifest has no name.
2. Put them in order. They take the stage slots after the 7 originals.
3. Installing them into a port waits on the `.imperfectarena` to `mods/Stages/*.stage` conversion ([Turlin Engine](https://github.com/NemesisMods/TurlinEngine)'s README has the `.stage` format).

## Shared Components

- **Arena list:** [Lab Builder](https://nemesismods.com/builder) reads it through [`@nemesismods/workspace`](https://github.com/NemesisMods/NemesisModsCore).

## Develop

```sh
npm install
npm run dev
npm run lint && npm test && npm run build
```