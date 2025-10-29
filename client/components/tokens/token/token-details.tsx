"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import React, { useEffect, useState } from "react";
import { Token } from "@/types/token";

interface TokenDetailsProps {
  tokenId: string;
}

export function TokenDetails({ tokenId }: TokenDetailsProps) {
  const [token, setToken] = useState<Token | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/tokens/${tokenId}`);
        const data = await res.json();

        if (!data.success) {
          setError(data.error || "Failed to fetch token");
          return;
        }

        setToken(data.token);
      } catch (err) {
        console.error("Error fetching token:", err);
        setError("Failed to load token data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [tokenId]);

  const formatNumber = (num: number | null) => {
    if (num === null || num === undefined) return "$0";
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (marketCap: number | null, supply: number = 1000000000) => {
    if (marketCap === null || marketCap === undefined) return "$0.000000";
    return `$${(marketCap / supply).toFixed(6)}`;
  };

  if (isLoading) {
    return (
      <div className="border-b uppercase p-8 animate-pulse">
        <div className="h-24 bg-muted rounded"></div>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="border-b uppercase p-8">
        <p className="text-destructive">{error || "Token not found"}</p>
      </div>
    );
  }

  const progress = token.bondingCurveProgress ?? 0;

  return (
    <div className="border-b uppercase">
      <div className="">
        <div className="flex items-start gap-4 border-b">
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={
                token.imageUrl ||
                "https://i.pinimg.com/1200x/b7/8f/02/b78f023aa1bca7bdada28db1c30d1fe5.jpg"
              }
              alt={token.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mt-2">
              <h1 className="text-2xl font-bold">{token.name}</h1>
              <Badge variant="secondary" className="rounded-none">
                {token.symbol}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{token.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-y mb-4">
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Price</p>
            <p className="text-2xl">{formatPrice(token.marketCap)}</p>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
            <p className="text-2xl">{formatNumber(token.marketCap)}</p>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Volume 24h</p>
            <p className="text-2xl">{formatNumber(token.volume)}</p>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Liquidity</p>
            <p className="text-2xl">{formatNumber(token.liquidity)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-xs px-4">
            <span className="text-muted-foreground">
              Bonding Curve Progress
            </span>
            <span className="font-medium">{progress.toFixed(2)}%</span>
          </div>
          <Progress value={progress} className="h-8" />
        </div>
      </div>
    </div>
  );
}
