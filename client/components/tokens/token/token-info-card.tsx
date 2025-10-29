"use client";

import { useEffect, useState } from "react";
import { Token } from "@/types/token";

interface TokenInfoCardProps {
  tokenId: string;
}

export function TokenInfoCard({ tokenId }: TokenInfoCardProps) {
  const [token, setToken] = useState<Token | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/tokens/${tokenId}`);
        const data = await res.json();
        
        if (data.success) {
          setToken(data.token);
        }
      } catch (err) {
        console.error("Error fetching token:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [tokenId]);

  if (isLoading) {
    return (
      <div className="w-full h-fit border-t uppercase p-4 animate-pulse">
        <div className="h-32 bg-muted rounded"></div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  const formatNumber = (num: number | null) => {
    if (num === null || num === undefined) return "$0";
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="w-full h-fit border-t uppercase">
      <div className="p-4 space-y-4">
        <div>
          <h4 className="text-sm font-bold text-muted-foreground mb-2">
            Description
          </h4>
          <p className="text-sm normal-case leading-relaxed">
            {token.description || "No description available"}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-muted-foreground mb-2">
            Links
          </h4>
          <div className="flex flex-wrap gap-2">
            {token.website && (
              <a
                href={token.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-secondary hover:bg-secondary/80 border text-xs transition-colors"
              >
                Website
              </a>
            )}
            {token.telegram && (
              <a
                href={token.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-secondary hover:bg-secondary/80 border text-xs transition-colors"
              >
                Telegram
              </a>
            )}
            {token.twitter && (
              <a
                href={token.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-secondary hover:bg-secondary/80 border text-xs transition-colors"
              >
                Twitter
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-muted-foreground mb-2">
            Token Information
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Market Cap:</span>
              <span className="font-bold">{formatNumber(token.marketCap)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Volume:</span>
              <span className="font-bold">{formatNumber(token.volume)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Liquidity:</span>
              <span className="font-bold">{formatNumber(token.liquidity)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress:</span>
              <span className="font-bold">{token.bondingCurveProgress ?? 0}%</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-muted-foreground mb-2">
            Addresses
          </h4>
          <div className="space-y-2">
            <div className="flex flex-col text-sm">
              <span className="text-muted-foreground mb-1">Mint Address:</span>
              <span className="font-mono text-xs break-all">{token.mintAddress}</span>
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-muted-foreground mb-1">Pool Address:</span>
              <span className="font-mono text-xs break-all">{token.poolAddress}</span>
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-muted-foreground mb-1">Creator:</span>
              <span className="font-mono text-xs break-all">{token.creatorAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
