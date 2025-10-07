"use client";

import React from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { CpAmm } from "@meteora-ag/cp-amm-sdk";
import BN from "bn.js";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "../ui/button";

export default function GraduatedSwap() {
  const connection = new Connection(
    process.env.NEXT_PUBLIC_RPC_URL!,
    "confirmed"
  );

  const TOKEN_MINT = new PublicKey(
    "HW5grQGzm8ZuEUCjTPDoTPBHw69MxTVKUceWJfdQqu31"
  );
  const POOL_ADDRESS = new PublicKey(
    "4sShgjDkQT5zsakYHrFXCHoCs2fK3ERYwYnAaHcS8rDX"
  );
  const cpAmm = new CpAmm(connection);
  const wallet = useWallet();

  async function handleSwap() {
    try {
      const poolState = await cpAmm.fetchPoolState(POOL_ADDRESS);
      console.log("Pool State:", poolState);
      if (!poolState) {
        toast.error("Pool state not found");
        throw new Error("Pool state not found");
      }
      const currentSlot = await connection.getSlot();

      console.log("Current Slot:", currentSlot);
      const blockTime = await connection.getBlockTime(currentSlot);
      console.log("Pool State:", poolState);

      if (blockTime === null) {
        toast.error("Unable to fetch block time");
        throw new Error("Unable to fetch block time");
      }

      const quote = await cpAmm.getQuote({
        inAmount: new BN(100_000_000),
        inputTokenMint: poolState.tokenAMint,
        slippage: 0.5,
        poolState,
        currentTime: blockTime,
        currentSlot,
        tokenADecimal: 9,
        tokenBDecimal: 6,
      });

      console.log("Quote:", quote);

      const swapTx = await cpAmm.swap({
        payer: wallet.publicKey!,
        pool: POOL_ADDRESS,
        inputTokenMint: poolState.tokenAMint,
        outputTokenMint: poolState.tokenBMint,
        amountIn: new BN(100_000_000),
        minimumAmountOut: quote.minSwapOutAmount,
        tokenAVault: poolState.tokenAVault,
        tokenBVault: poolState.tokenBVault,
        tokenAMint: poolState.tokenAMint,
        tokenBMint: poolState.tokenBMint,
        tokenAProgram: new PublicKey(
          "So11111111111111111111111111111111111111112"
        ),
        tokenBProgram: TOKEN_MINT,
        referralTokenAccount: null,
      });

      console.log("Swap Transaction:", swapTx);
    } catch (error) {
      console.error("Error occurred during swap:", error);
      toast.error("Error occurred during swap");
    }
  }
  return <Button onClick={handleSwap}>Swap</Button>;
}
