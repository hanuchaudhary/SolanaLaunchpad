import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Token } from "@/types/token";

interface TokenCardProps {
  token: Token;
  href: string;
}

export function TokenCard({ token, href }: TokenCardProps) {
  const formatAddress = (address: string) => {
    if (!address || address.length < 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatNumber = (num: number | null) => {
    if (num === null || num === undefined) return "$0";
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const progress = token.bondingCurveProgress ?? 0;

  return (
    <Link href={href}>
      <Card className="hover:shadow-2xl uppercase transition-shadow gap-0 cursor-pointer h-full rounded-none border-0 p-0">
        <CardHeader className="pb-4 px-0">
          <div className="flex items-start gap-4">
            <div className="relative w-26 h-26 flex-shrink-0">
              <Image
                unoptimized
                src={
                  token.imageUrl ||
                  "https://i.pinimg.com/1200x/b7/8f/02/b78f023aa1bca7bdada28db1c30d1fe5.jpg"
                }
                alt={token.name || "Token"}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 py-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg truncate">{token.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {token.symbol}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {token.description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-0">
          <div className="grid grid-cols-2 gap-4 px-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
              <p className="font-semibold text-xs">
                {formatNumber(token.marketCap)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Created At</p>
              <p className="font-semibold text-xs">
                {new Date(token.createdAt!).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 px-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Liquidity</p>
              <p className="font-semibold text-xs">
                {formatNumber(token.liquidity)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Mint Address</p>
              <p className="font-semibold text-xs font-mono">
                {formatAddress(token.mintAddress)}
              </p>
            </div>
          </div>
          <div className="space-y-2 relative">
            <div className="flex justify-between text-sm absolute bottom-0 left-1/2 -translate-x-1/2 px-8 w-full">
              <span className="text-muted-foreground"></span>
              <span className="font-medium">{progress.toFixed(2)}%</span>
            </div>
            <Progress value={progress} className="h-10" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
