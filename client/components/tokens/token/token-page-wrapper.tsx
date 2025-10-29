"use client";

import React from "react";
import { addRecentToken } from "./recently-opened";

interface TokenPageWrapperProps {
  tokenId: string;
  children: React.ReactNode;
}

const formatPrice = (marketCap: number | null, supply: number = 1000000000) => {
  if (marketCap === null || marketCap === undefined) return "$0.000000";
  return `$${(marketCap / supply).toFixed(6)}`;
};

export function TokenPageWrapper({ tokenId, children }: TokenPageWrapperProps) {
  React.useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const res = await fetch(`/api/tokens/${tokenId}`);
        const data = await res.json();

        if (data.success && data.token) {
          addRecentToken({
            id: tokenId,
            name: data.token.name || "Unknown Token",
            symbol: data.token.symbol || "???",
            image: data.token.imageUrl || "https://i.pinimg.com/1200x/b7/8f/02/b78f023aa1bca7bdada28db1c30d1fe5.jpg",
            price: formatPrice(data.token.marketCap),
          });
        }
      } catch (error) {
        console.error("Failed to fetch token data for recent tokens:", error);
      }
    };

    fetchTokenData();
  }, [tokenId]);

  return <>{children}</>;
}
