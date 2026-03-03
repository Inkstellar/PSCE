"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  Heart,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  stats: {
    totalBooks: number;
    totalUsers: number;
    totalWishlists: number;
    totalOrders: number;
    totalRevenue: number;
  };
  lowStockBooks: Array<{
    id: string;
    name: string;
    stock: number;
  }>;
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
  recentUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
  }>;
}

export function DashboardStats() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          const stats = await response.json();
          setData(stats);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Books",
      value: data.stats.totalBooks,
      icon: BookOpen,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      title: "Total Users",
      value: data.stats.totalUsers,
      icon: Users,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      title: "Wishlists",
      value: data.stats.totalWishlists,
      icon: Heart,
      color: "text-pink-400",
      bgColor: "bg-pink-400/10",
    },
    {
      title: "Total Orders",
      value: data.stats.totalOrders,
      icon: ShoppingBag,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Card */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <IndianRupee className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-4xl font-bold text-foreground">
                ₹{data.stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="ml-auto">
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.lowStockBooks.length === 0 ? (
              <p className="text-muted-foreground text-sm">All books are well stocked!</p>
            ) : (
              <ul className="space-y-3">
                {data.lowStockBooks.map((book) => (
                  <li
                    key={book.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm text-foreground">{book.name}</span>
                    <Badge
                      variant="destructive"
                      className="bg-red-500/10 text-red-400 border-red-500/20"
                    >
                      {book.stock} left
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Most Wishlisted */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Most Wishlisted
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.mostWishlisted.length === 0 ? (
              <p className="text-muted-foreground text-sm">No wishlist data yet</p>
            ) : (
              <ul className="space-y-3">
                {data.mostWishlisted.map((book, index) => (
                  <li
                    key={book.id}
                    className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm text-muted-foreground w-5">
                      #{index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{book.name}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                    <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20">
                      <Heart className="h-3 w-3 mr-1" />
                      {book._count.wishlist}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            Recent Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">
                    Name
                  </th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">
                    Email
                  </th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">
                    Role
                  </th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-foreground">
                      {user.name || "N/A"}
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="py-3">
                      <Badge
                        className={
                          user.role === "ADMIN"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
