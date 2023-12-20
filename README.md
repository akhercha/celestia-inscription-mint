# Cosmos Inscriptions Mint

Small script to automate the minting of inscriptions in the Cosmos ecosystem.

> [!WARNING]  
> Not battle tested. Use at your own risks.

Code reference: [qzz0518/coss](https://github.com/qzz0518/coss)

Forked from: [sfter/cias-mint](https://github.com/sfter/cias-mint)

## Step 1: Installation

```bash
git clone git@github.com:akhercha/celestia-inscription-mint.git
cd celestia-inscription-mint
bun install
cp .env.example .env
```

## Step 2: Configuration of the environment variables

```bash
# RPC configuration, you can find your preferred node server at https://atomscan.com/directory/celestia
NODE_URL=https://public-celestia-rpc.numia.xyz
# NODE_URL=https://celestia-rpc.mesa.newmetric.xyz

# Main wallet used for minting
PRIVATE_KEY=
```

## Step 3: Update the configuration at the top of `mint.ts`

```typescript
// Chain configuration (here Celestia)
const DENOM = "utia";
const CHAIN = "celestia";

// Mint informations
const MEMO_MINT_DATA = `data:,{"op":"mint","amt":10000,"tick":"cias","p":"cia-20"}`;
const NUMBER_OF_TIMES_TO_MINT = 2;
const TIME_TO_WAIT_BETWEEN_FAILURES = 1000; // in milliseconds
```

## Step 4: Start minting

```bash
bun run mint
```
