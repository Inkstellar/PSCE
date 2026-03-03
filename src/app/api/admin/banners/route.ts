import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all banners
export async function GET() {
  try {
    const banners = await db.banner.findMany({
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

// POST create new banner
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Get max order
    const maxOrder = await db.banner.aggregate({
      _max: { order: true },
    });
    const newOrder = (maxOrder._max.order || 0) + 1;

    const banner = await db.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl || null,
        order: newOrder,
        active: data.active ?? true,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
