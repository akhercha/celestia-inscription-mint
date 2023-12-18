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

# Main wallet (funding wallet) private key, used to transfer funds to other wallets actually used for Minting
PRIVATE_KEY=

# Wallet generation configuration, configure as needed
# Number of Mint wallets to generate
NUM_OF_WALLETS=5
# File for wallets actually used for Mint, all generated wallets are in this file
WALLET_JSON_FILE=wallets.json

# Celestia configuration (can be left as is)
CHAIN_SYMBOL=celestia
TOKEN_DENOM=utia
TOKEN_DECIMAL=1000000

# Amount of TIA to transfer from the main wallet (funding wallet) to each wallet actually used for Mint
TOKEN_TRANSFER_AMOUNT=2

# Gas configuration, modify as needed
GAS_PRICE=10000
GAS_LIMIT=100000

# Mint configuration, must be configured according to official parameters
MINT_AMOUNT=10000
# Inscription token name
TICK=cias
# Protocol type
PROTOCOL=cia-20

# Number of times each wallet mints
MINT_TIMES=10
```

## Step 3: Generate wallets

```bash
bun wallet_gen.js
```

## Step 4: Step 4: Batch Transfer from Main Wallet (Funding Wallet) to Mint Wallets

```bash
bun transfer.js
```

## Step 5: Run the Mint Program to Start Minting

```bash
bun mint.js
```

## Notes

If you cannot export the private key from the Keplr wallet, you can do so through the following method:

1. First, configure the `.env` file, leaving `PRIVATE_KEY` blank.
2. Use `bun wallet_gen.js` to generate wallets
3. Open the `wallet.json` file in the current directory
4. Select any wallet as the main wallet.
5. Open the Keplr wallet, transfer some $TIA to the wallet address you selected in step 4 above.
6. Configure the wallet address you selected in step 4 above in the `PRIVATE_KEY` field in the `.env` file.
7. Execute `bun transfer.js` to batch transfer from the wallet selected in step 4 to other Mint wallets.
8. Execute `bun mint.js` to start batch Minting, completion OK.
