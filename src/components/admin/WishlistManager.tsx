"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Heart, Search, Loader2, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface WishlistItem {
  id: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  book: {
    id: string;
    name: string;
    author: string;
    price: number;
    coverImage: string | null;
  };
}

interface WishlistStats {
  totalItems: number;
  mostWishlisted: Array<{
    id: string;
    name: string;
    author: string;
    price: number;
    coverImage: string | null;
    _count: {
      wishlist: number;
    };
  }>;
}

export function WishlistManager() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [stats, setStats] = useState<WishlistStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsResponse = await fetch("/api/admin/stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats({
            totalItems: statsData.stats.totalWishlists,
            mostWishlisted: statsData.mostWishlisted,
          });
        }
      } catch (error) {
        console.error("Failed to fetch wishlist data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-pink-500/10">
                <Heart className="h-6 w-6 text-pink-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Wishlist Items</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.totalItems || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Wishlisted Books */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Most Wishlisted Books
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!stats?.mostWishlisted || stats.mostWishlisted.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No wishlist data yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.mostWishlisted.map((book, index) => (
                <div
                  key={book.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-accent/50"
                >
                  <span className="text-2xl font-bold text-muted-foreground w-8">
                    #{index + 1}
                  </span>
                  <div className="relative w-16 h-20 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={book.coverImage || "/images/banner1.png"}
                      alt={book.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{book.name}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <div className="flex items-center gap-1 mt-1 text-primary">
                      <IndianRupee className="h-4 w-4" />
                      <span className="font-medium">{book.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 text-lg px-3">
                    <Heart className="h-4 w-4 mr-1" />
                    {book._count.wishlist}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
