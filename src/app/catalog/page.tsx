"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  Skull,
  Calendar,
  User,
  IndianRupee,
  Search,
  ArrowUpDown,
  Grid3X3,
  List,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Autoplay from "embla-carousel-autoplay";
import { Header } from "@/components/layout/Header";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { Toaster } from "@/components/ui/toaster";

interface Book {
  id: string;
  name: string;
  description: string;
  author: string;
  price: number;
  coverImage: string | null;
  publishedAt: string;
  stock: number;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string | null;
  order: number;
  active: boolean;
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("publishedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes] = await Promise.all([
          fetch("/api/banners"),
        ]);

        if (bannersRes.ok) {
          const bannersData = await bannersRes.json();
          setBanners(bannersData);
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/books/all?search=${search}&sortBy=${sortBy}&order=${order}`
        );
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [search, sortBy, order]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header currentPath="/catalog" />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Banner Carousel */}
        <section className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {banners.length > 0
                ? banners.map((banner) => (
                    <CarouselItem key={banner.id}>
                      <div className="relative h-[200px] md:h-[300px] w-full">
                        <Image
                          src={banner.imageUrl}
                          alt={banner.title}
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
                          <div className="max-w-xl">
                            <Badge className="mb-3 bg-primary/20 text-purple-light border-primary/30">
                              Featured
                            </Badge>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                              {banner.title}
                            </h2>
                            <p className="text-muted-foreground text-sm md:text-base mb-4">
                              {banner.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))
                : [
                    {
                      id: "1",
                      image: "/images/banner1.png",
                      title: "Browse Our Catalog",
                      subtitle: "Discover thousands of comics and graphic novels",
                    },
                  ].map((slide) => (
                    <CarouselItem key={slide.id}>
                      <div className="relative h-[200px] md:h-[300px] w-full">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
                          <div className="max-w-xl">
                            <Badge className="mb-3 bg-primary/20 text-purple-light border-primary/30">
                              Featured
                            </Badge>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                              {slide.title}
                            </h2>
                            <p className="text-muted-foreground text-sm md:text-base mb-4">
                              {slide.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-card/80 border-border hover:bg-accent" />
            <CarouselNext className="right-4 bg-card/80 border-border hover:bg-accent" />
          </Carousel>
        </section>

        {/* Catalog Section */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          {/* Section Header */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Skull className="h-6 w-6 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Comic Catalog
              </h1>
            </div>
            <p className="text-muted-foreground">
              Browse our complete collection of comics and graphic novels
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-background border-border">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publishedAt">Release Date</SelectItem>
                  <SelectItem value="name">Title</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                className="border-border"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>

              <div className="hidden sm:flex gap-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-primary" : "border-border"}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-primary" : "border-border"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-4">
            {loading ? "Loading..." : `${books.length} comics found`}
          </p>

          {/* Books Grid/List */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card
                  key={i}
                  className="bg-card border-border overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-2/3 mb-4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16">
              <Skull className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg">No comics found</p>
              <p className="text-muted-foreground text-sm mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <Link key={book.id} href={`/book/${book.id}`}>
                  <Card
                    className="group bg-card border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={book.coverImage || "/images/banner1.png"}
                        alt={book.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                      {book.stock < 5 && book.stock > 0 && (
                        <Badge className="absolute top-3 left-3 bg-amber-500/90 text-amber-foreground">
                          Low Stock
                        </Badge>
                      )}
                      {book.stock === 0 && (
                        <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                          Out of Stock
                        </Badge>
                      )}
                      <div
                        onClick={(e) => e.preventDefault()}
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <WishlistButton
                          bookId={book.id}
                          bookName={book.name}
                          variant="icon"
                        />
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-bold text-foreground text-lg mb-1 line-clamp-1 group-hover:text-purple-light transition-colors">
                        {book.name}
                      </h3>

                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-2">
                        <User className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{book.author}</span>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {book.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-1 text-primary font-bold">
                          <IndianRupee className="h-4 w-4" />
                          <span>{book.price.toLocaleString()}</span>
                        </div>
                        <div onClick={(e) => e.preventDefault()}>
                          <WishlistButton
                            bookId={book.id}
                            bookName={book.name}
                            variant="ghost"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {books.map((book) => (
                <Link key={book.id} href={`/book/${book.id}`}>
                  <Card
                    className="group bg-card border-border overflow-hidden hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="flex">
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <Image
                          src={book.coverImage || "/images/banner1.png"}
                          alt={book.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-foreground text-lg group-hover:text-purple-light transition-colors">
                              {book.name}
                            </h3>
                            <p className="text-muted-foreground text-sm">{book.author}</p>
                          </div>
                          <div className="flex items-center gap-1 text-primary font-bold text-lg">
                            <IndianRupee className="h-5 w-5" />
                            <span>{book.price.toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                          {book.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(book.publishedAt), "MMM d, yyyy")}
                          </span>
                          {book.stock < 5 && book.stock > 0 && (
                            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                              {book.stock} left
                            </Badge>
                          )}
                          <div onClick={(e) => e.preventDefault()}>
                            <WishlistButton
                              bookId={book.id}
                              bookName={book.name}
                              variant="button"
                              className="ml-auto"
                              showText
                            />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                  <Image
                    src="/images/logo.png"
                    alt="Purple Skull Comics Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-purple-light">
                    Purple Skull
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Comics Emporium
                  </span>
                </div>
              </Link>
              <p className="text-muted-foreground text-sm max-w-md">
                Your premier destination for comic books, graphic novels, and
                collectibles. We&apos;ve been serving comic enthusiasts since 2010.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/catalog"
                    className="text-sm text-muted-foreground hover:text-purple-light transition-colors"
                  >
                    Catalog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-purple-light transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-purple-light transition-colors"
                  >
                    Membership
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-purple-light transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Visit Us</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>123 Comic Lane</li>
                <li>Gotham City, GC 12345</li>
                <li className="pt-2">Mon-Sat: 10AM - 9PM</li>
                <li>Sun: 11AM - 6PM</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Purple Skull Comics Emporium. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <Toaster />
      <Toaster />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
