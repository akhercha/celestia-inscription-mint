import dotenv from "dotenv";
import { SigningStargateClient, GasPrice, coins } from "@cosmjs/stargate";
import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import { base64FromBytes } from "cosmjs-types/helpers";

dotenv.config();

// ----------------------------------------------------------------------------

// Chain configuration (here Celestia)
const DENOM = "utia";
const CHAIN = "celestia";

// ----------------------------------------------------------------------------

// Mint informations
const MEMO_MINT_DATA = `data:,{"op":"mint","amt":10000,"tick":"cias","p":"cia-20"}`;
const NUMBER_OF_TIMES_TO_MINT = 500;
const TIME_TO_WAIT_BETWEEN_FAILURES = 5000; // in milliseconds
const AMOUNT_TO_SELF_SEND = 1;

// ----------------------------------------------------------------------------

const mint = async (
  privateKey: string,
  numberOfTimes: number = NUMBER_OF_TIMES_TO_MINT
): Promise<void> => {
  const rpcEndpoint = process.env.NODE_URL || "";
  if (rpcEndpoint === "") {
    throw new Error("NODE_URL in .env must be defined");
  }

  console.log(`Minting ${numberOfTimes} times...`);
  const wallet = await DirectSecp256k1Wallet.fromKey(
    Buffer.from(privateKey, "hex"),
    CHAIN
  );

  const client = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    wallet,
    { gasPrice: GasPrice.fromString(`0.025${DENOM}`) }
  );

  let successCount = 0;
  let attemptCount = 0;
  console.log("--------------------------------------------------");
  while (attemptCount < numberOfTimes) {
    console.log(`Attempt ${attemptCount + 1}...`);
    try {
      const [account] = await wallet.getAccounts();
      const amount = coins(AMOUNT_TO_SELF_SEND, DENOM);
      const result = await client.sendTokens(
        account.address,
        account.address,
        amount,
        {
          amount: coins(120000, DENOM),
          gas: "140000",
        },
        base64FromBytes(Buffer.from(MEMO_MINT_DATA, "utf8"))
      );
      console.log(
        `Successful mint: ${
          `https://www.mintscan.io/${CHAIN}/tx/` + result.transactionHash
        }\n`
      );
      successCount++;
    } catch (error) {
      console.error(`Attempt ${attemptCount + 1} failed: `, error.message);
      await new Promise((resolve) =>
        setTimeout(resolve, TIME_TO_WAIT_BETWEEN_FAILURES)
      );
    }
    attemptCount++;
  }
  console.log("--------------------------------------------------");
  console.log("Minting completed!");
  console.log(`${successCount} / ${attemptCount} successful attempts`);
};

const main = async () => {
  const privateKey = process.env.PRIVATE_KEY || "";
  if (privateKey === "") {
    throw new Error("PRIVATE_KEY in .env must be defined");
  }
  await mint(privateKey);
};

main();
