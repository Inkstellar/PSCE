import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET single book by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await db.book.findUnique({
      where: { id },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Parse characters JSON if it exists
    let characters: string[] = [];
    if (book.characters) {
      try {
        characters = JSON.parse(book.characters);
      } catch {
        characters = [];
      }
    }

    return NextResponse.json({
      ...book,
      characters,
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}
