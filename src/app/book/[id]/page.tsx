"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  Skull,
  Star,
  ChevronRight,
  Calendar,
  User,
  IndianRupee,
  Package,
  Heart,
  Check,
  Minus,
  Plus,
  Loader2,
  BookOpen,
  FileText,
  Globe,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  isbn: string | null;
  pages: number | null;
  language: string;
  publisher: string | null;
  characters: string[];
  rating: number;
  reviewCount: number;
  series: string | null;
}

interface SimilarBooks {
  byAuthor: Book[];
  byPublisher: Book[];
  byCharacters: Book[];
}

function BookPageContent() {
  const params = useParams();
  const bookId = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [similarBooks, setSimilarBooks] = useState<SimilarBooks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) {
        setError("No book ID provided");
        setLoading(false);
        return;
      }

      try {
        const [bookRes, similarRes] = await Promise.all([
          fetch(`/api/books/${bookId}`),
          fetch(`/api/books/similar/${bookId}`),
        ]);

        if (!bookRes.ok) {
          throw new Error("Book not found");
        }

        const bookData = await bookRes.json();
        setBook(bookData);

        if (similarRes.ok) {
          const similarData = await similarRes.json();
          setSimilarBooks(similarData);
        }
      } catch (err) {
        setError("Failed to load book details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  // Render star rating
  const renderStars = (rating: number): React.ReactNode[] => {
    const stars: React.ReactNode[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-muted-foreground" />);
      }
    }
    return stars;
  };

  // Render book card
  const renderBookCard = (bookItem: Book, size: "small" | "medium" = "medium") => {
    const heightClass = size === "small" ? "h-32" : "h-48";
    
    return (
      <Link href={`/book/${bookItem.id}`} key={bookItem.id}>
        <Card className="group bg-card border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <div className={`relative ${heightClass} overflow-hidden`}>
            <Image
              src={bookItem.coverImage || "/images/banner1.png"}
              alt={bookItem.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
          </div>
          <CardContent className="p-3">
            <h3 className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-purple-light transition-colors">
              {bookItem.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{bookItem.author}</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex">{renderStars(bookItem.rating)}</div>
            </div>
            <div className="flex items-center gap-1 text-primary font-bold text-sm mt-1">
              <IndianRupee className="h-3 w-3" />
              <span>{bookItem.price.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header currentPath={`/book/${bookId}`} />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading book details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header currentPath={`/book/${bookId}`} />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Package className="h-16 w-16 text-muted-foreground/50" />
            <h2 className="text-xl font-bold text-foreground">{error || "Book not found"}</h2>
            <Link href="/catalog">
              <Button className="bg-primary hover:bg-primary/90">
                Browse Catalog
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header currentPath={`/book/${book.id}`} />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-purple-light">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/catalog" className="hover:text-purple-light">Catalog</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground line-clamp-1">{book.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-4">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border bg-card">
                <Image
                  src={book.coverImage || "/images/banner1.png"}
                  alt={book.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Middle Column - Product Info */}
            <div className="lg:col-span-5 space-y-6">
              {/* Title & Author */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {book.name}
                </h1>
                {book.series && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                    Part of: {book.series}
                  </Badge>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>by <span className="text-purple-light font-medium">{book.author}</span></span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {renderStars(book.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {book.rating.toFixed(1)} out of 5
                </span>
                {book.reviewCount > 0 && (
                  <span className="text-sm text-purple-light">
                    ({book.reviewCount} {book.reviewCount === 1 ? "review" : "reviews"})
                  </span>
                )}
              </div>

              {/* Publisher & Date */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {book.publisher && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Publisher: <span className="text-foreground">{book.publisher}</span></span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(book.publishedAt), "MMMM d, yyyy")}</span>
                </div>
              </div>

              {/* Characters */}
              {book.characters && book.characters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Characters:</span>
                  {book.characters.map((character, index) => (
                    <Badge key={index} variant="outline" className="border-border">
                      {character}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="border-t border-border pt-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Book Details */}
              <div className="border-t border-border pt-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">Product Details</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {book.isbn && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">ISBN:</span>
                      <span className="text-foreground">{book.isbn}</span>
                    </div>
                  )}
                  {book.pages && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{book.pages} pages</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{book.language}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Purchase */}
            <div className="lg:col-span-3">
              <Card className="bg-card border-border sticky top-24">
                <CardContent className="p-4 space-y-4">
                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      <span className="text-lg">₹</span>{book.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Stock Status */}
                  {book.stock === 0 ? (
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20 w-full justify-center py-2">
                      Out of Stock
                    </Badge>
                  ) : book.stock < 5 ? (
                    <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 w-full justify-center py-2">
                      Only {book.stock} left in stock
                    </Badge>
                  ) : (
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 w-full justify-center py-2">
                      <Check className="h-4 w-4 mr-1" /> In Stock
                    </Badge>
                  )}

                  {/* Quantity Selector */}
                  {book.stock > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">Quantity:</span>
                      <div className="flex items-center border border-border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                          disabled={quantity >= book.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  {book.stock > 0 && (
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      Add to Cart
                    </Button>
                  )}

                  {/* Wishlist Button */}
                  <WishlistButton
                    bookId={book.id}
                    bookName={book.name}
                    variant="button"
                    className="w-full"
                    showText
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Similar Books Sections */}
          {(similarBooks?.byAuthor.length || similarBooks?.byPublisher.length || similarBooks?.byCharacters.length) && (
            <div className="mt-16 space-y-12">
              {similarBooks?.byAuthor && similarBooks.byAuthor.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Skull className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">
                      More by {book.author}
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {similarBooks.byAuthor.slice(0, 5).map((b) => renderBookCard(b))}
                  </div>
                </section>
              )}

              {similarBooks?.byPublisher && similarBooks.byPublisher.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Skull className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">
                      More from {book.publisher}
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {similarBooks.byPublisher.slice(0, 5).map((b) => renderBookCard(b))}
                  </div>
                </section>
              )}

              {similarBooks?.byCharacters && similarBooks.byCharacters.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Skull className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">
                      More with Same Characters
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {similarBooks.byCharacters.slice(0, 5).map((b) => renderBookCard(b))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Purple Skull Comics Emporium. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <BookPageContent />
    </Suspense>
  );
}
