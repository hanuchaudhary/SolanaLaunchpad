import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ mint: string }> }
) {
  try {
    const { mint } = await params;

    if (!mint) {
      return NextResponse.json(
        { success: false, error: "Token ID is required" },
        { status: 400 }
      );
    }

    const res = await axios.get(
      `https://lite-api.jup.ag/tokens/v2/search?query=${mint}`
    );

    let token;
    if (res.data.length) {
      token = await prisma.token.update({
        where: { mintAddress: mint },
        data: {
          bondingCurveProgress: res.data[0].bondingCurve,
          volume: res.data[0].volume,
          liquidity: res.data[0].liquidity,
          marketCap: res.data[0].mcap,
        },
      });
    }

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("Error fetching token:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ mint: string }> }
) {
  try {
    const { mint } = await params;

    if (!mint) {
      return NextResponse.json(
        { success: false, error: "Token mint address is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { description, twitter, telegram, website } = body;
    if (!description && !twitter && !telegram && !website) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }
    let token;

    const updateData: any = {};
    if (description !== undefined) updateData.description = description;
    if (twitter !== undefined) updateData.twitter = twitter;
    if (telegram !== undefined) updateData.telegram = telegram;
    if (website !== undefined) updateData.website = website;

    token = await prisma.token.update({
      where: {
        mintAddress: mint,
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      token,
      message: "Token updated successfully",
    });
  } catch (error) {
    console.error("Error updating token:", error);
    if ((error as any).code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Token not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
