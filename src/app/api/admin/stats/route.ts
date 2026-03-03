import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get total counts
    const totalBooks = await db.book.count();
    const totalUsers = await db.user.count();
    const totalWishlists = await db.wishlist.count();
    const totalOrders = await db.order.count();

    // Get total revenue from orders
    const orders = await db.order.findMany({
      where: {
        status: {
          in: ["CONFIRMED", "SHIPPED", "DELIVERED"],
        },
      },
      select: {
        total: true,
      },
    });
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Get low stock books (less than 5)
    const lowStockBooks = await db.book.findMany({
      where: {
        stock: {
          lt: 5,
        },
      },
      select: {
        id: true,
        name: true,
        stock: true,
      },
      take: 5,
    });

    // Get most wishlisted books
    const mostWishlisted = await db.book.findMany({
      select: {
        id: true,
        name: true,
        author: true,
        price: true,
        coverImage: true,
        _count: {
          select: {
            wishlist: true,
          },
        },
      },
      orderBy: {
        wishlist: {
          _count: "desc",
        },
      },
      take: 5,
    });

    // Get recent users
    const recentUsers = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return NextResponse.json({
      stats: {
        totalBooks,
        totalUsers,
        totalWishlists,
        totalOrders,
        totalRevenue,
      },
      lowStockBooks,
      mostWishlisted,
      recentUsers,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
