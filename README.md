# Celestia ($TIA) Public Chain Inscription cias mint Script

Code reference: [qzz0518/coss](https://github.com/qzz0518/coss)
Forked from: [sfter/cias-mint](https://github.com/sfter/cias-mint)

## Step 1: Installation

```bash
git clone https://github.com/akhercha/cias-mint
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

## Step 3: Run the Mint Program to Start Minting

```bash
bun run mint.ts
```
