import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET active banners for public display
export async function GET() {
  try {
    const banners = await db.banner.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}
