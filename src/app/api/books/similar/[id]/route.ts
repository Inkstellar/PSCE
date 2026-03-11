import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET similar books based on author, publisher, and characters
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "8");

    // Get the current book
    const currentBook = await db.book.findUnique({
      where: { id },
    });

    if (!currentBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Parse characters from current book
    let currentCharacters: string[] = [];
    if (currentBook.characters) {
      try {
        currentCharacters = JSON.parse(currentBook.characters);
      } catch {
        currentCharacters = [];
      }
    }

    // Build queries for similar books
    const baseWhere = {
      id: { not: id }, // Exclude current book
    };

    // Find books by same author
    const byAuthor = await db.book.findMany({
      where: {
        ...baseWhere,
        author: currentBook.author,
      },
      take: limit,
      orderBy: { publishedAt: "desc" },
    });

    // Find books by same publisher (if publisher exists)
    let byPublisher: typeof byAuthor = [];
    if (currentBook.publisher) {
      byPublisher = await db.book.findMany({
        where: {
          ...baseWhere,
          publisher: currentBook.publisher,
        },
        take: limit,
        orderBy: { publishedAt: "desc" },
      });
    }

    // Find books with matching characters
    let byCharacters: typeof byAuthor = [];
    if (currentCharacters.length > 0) {
      // Get all books that have characters
      const allBooksWithCharacters = await db.book.findMany({
        where: {
          ...baseWhere,
          characters: { not: null },
        },
      });

      // Filter books that share at least one character
      const matchingBooks = allBooksWithCharacters.filter((book) => {
        if (!book.characters) return false;
        try {
          const bookCharacters = JSON.parse(book.characters) as string[];
          return currentCharacters.some((char) =>
            bookCharacters.includes(char)
          );
        } catch {
          return false;
        }
      });

      byCharacters = matchingBooks.slice(0, limit);
    }

    // Remove duplicates and limit results
    const removeDuplicates = (books: typeof byAuthor) => {
      const seen = new Set<string>();
      return books.filter((book) => {
        if (seen.has(book.id)) return false;
        seen.add(book.id);
        return true;
      });
    };

    return NextResponse.json({
      byAuthor: removeDuplicates(byAuthor),
      byPublisher: removeDuplicates(byPublisher),
      byCharacters: removeDuplicates(byCharacters),
    });
  } catch (error) {
    console.error("Error fetching similar books:", error);
    return NextResponse.json(
      { error: "Failed to fetch similar books" },
      { status: 500 }
    );
  }
}
