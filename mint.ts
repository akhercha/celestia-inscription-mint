import dotenv from "dotenv";
import { SigningStargateClient, GasPrice, coins } from "@cosmjs/stargate";
import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import { base64FromBytes } from "cosmjs-types/helpers";

dotenv.config();

// ----------------------------------------------------------------------------

// Chain configuration (here Celestia)

const DENOM = "utia";
const CHAIN = "celestia";
const GAS_PRICE = 10000;
const GAS_LIMIT = 100000;

// ----------------------------------------------------------------------------

// Mint informations

const MEMO_MINT_DATA = `data:,{"op":"mint","amt":10000,"tick":"cias","p":"cia-20"}`;
const NUMBER_OF_TIMES_TO_MINT = 100;
const TIME_TO_WAIT_BETWEEN_FAILURES = 1000; // in milliseconds

// ----------------------------------------------------------------------------

async function performTransaction(privateKey, numberOfTimes) {
  const rpcEndpoint = process.env.NODE_URL || "";
  if (rpcEndpoint === "") {
    throw new Error("NODE_URL in .env must be defined");
  }

  const wallet = await DirectSecp256k1Wallet.fromKey(
    Buffer.from(privateKey, "hex"),
    CHAIN
  );

  const client = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    wallet,
    { gasPrice: GasPrice.fromString(`0.025${DENOM}`) }
  );

  const fee: any = {
    amount: coins(GAS_PRICE, DENOM),
    gas: GAS_LIMIT,
  };

  let successCount = 0;
  let attemptCount = 0;
  while (successCount < numberOfTimes) {
    try {
      const [account] = await wallet.getAccounts();
      const amount = coins(1, DENOM); // Transfer 1 unit to self
      const result = await client.sendTokens(
        account.address,
        account.address,
        amount,
        fee,
        base64FromBytes(Buffer.from(MEMO_MINT_DATA, "utf8"))
      );
      console.log(
        `${account.address}, Successful operation ${successCount + 1}: ${
          `https://www.mintscan.io/${CHAIN}/tx/` + result.transactionHash
        }`
      );
      successCount++;
    } catch (error) {
      console.error(`Attempt ${attemptCount + 1} failed: `, error);
      await new Promise((resolve) =>
        setTimeout(resolve, TIME_TO_WAIT_BETWEEN_FAILURES)
      );
    }
    attemptCount++;
  }
  console.log(`${successCount} / ${attemptCount} successful mints`);
}

async function main() {
  const privateKey = process.env.PRIVATE_KEY || "";
  if (privateKey === "") {
    throw new Error("PRIVATE_KEY in .env must be defined");
  }
  await performTransaction(privateKey, NUMBER_OF_TIMES_TO_MINT);
}

main();
