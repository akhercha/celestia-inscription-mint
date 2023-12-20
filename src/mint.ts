import dotenv from "dotenv";
import {
  SigningStargateClient,
  GasPrice,
  coins,
  DeliverTxResponse,
  StdFee,
} from "@cosmjs/stargate";
import { Coin, DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
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
  rpcEndpoint: string,
  numberOfTimes: number = NUMBER_OF_TIMES_TO_MINT
): Promise<void> => {
  const wallet: DirectSecp256k1Wallet = await DirectSecp256k1Wallet.fromKey(
    Buffer.from(privateKey, "hex"),
    CHAIN
  );
  const client: SigningStargateClient =
    await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, {
      gasPrice: GasPrice.fromString(`0.025${DENOM}`),
    });

  let successCount: number = 0;
  let attemptCount: number = 0;
  console.log(`Minting ${numberOfTimes} times...`);
  console.log("--------------------------------------------------");

  while (attemptCount < numberOfTimes) {
    console.log(`Attempt ${attemptCount + 1}...`);
    try {
      const [account] = await wallet.getAccounts();
      const amount: Coin[] = coins(AMOUNT_TO_SELF_SEND, DENOM);

      // TODO: set a correct fee & increase everytime it fails
      // can also be "auto"
      const fees: StdFee = {
        amount: coins(120000, DENOM),
        gas: "140000",
      };

      const result: DeliverTxResponse = await client.sendTokens(
        account.address,
        account.address,
        amount,
        fees,
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
  const rpcEndpoint = process.env.NODE_URL || "";
  if (privateKey === "" || rpcEndpoint === "") {
    throw new Error(".env variables must be defined. See .env.example");
  }
  await mint(privateKey, rpcEndpoint);
};

main();
