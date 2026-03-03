import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "publishedAt";
    const order = searchParams.get("order") || "desc";

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { author: { contains: search } },
          ],
        }
      : {};

    const orderBy: Record<string, "asc" | "desc"> = {};
    orderBy[sortBy] = order as "asc" | "desc";

    const books = await db.book.findMany({
      where,
      orderBy,
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching all books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
