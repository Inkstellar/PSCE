import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all books with pagination and search
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { author: { contains: search } },
          ],
        }
      : {};

    const [books, total] = await Promise.all([
      db.book.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.book.count({ where }),
    ]);

    return NextResponse.json({
      books,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

// POST create new book
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const book = await db.book.create({
      data: {
        name: data.name,
        description: data.description,
        author: data.author,
        price: parseFloat(data.price),
        coverImage: data.coverImage || null,
        publishedAt: new Date(data.publishedAt),
        stock: parseInt(data.stock) || 0,
        isbn: data.isbn || null,
        pages: data.pages ? parseInt(data.pages) : null,
        language: data.language || "English",
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}
