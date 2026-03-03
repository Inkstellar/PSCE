"use client";

// Purple Skull Comics - Landing Page
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { signIn, signOut, useSession } from "next-auth/react";
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
import { Toaster } from "@/components/ui/toaster";
import {
  Skull,
  ChevronRight,
  Calendar,
  User,
  IndianRupee,
  Shield,
  X,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Header } from "@/components/layout/Header";
import { AuthModal } from "@/components/admin/AuthModal";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { BookManager } from "@/components/admin/BookManager";
import { BannerManager } from "@/components/admin/BannerManager";
import { UserManager } from "@/components/admin/UserManager";
import { WishlistManager } from "@/components/admin/WishlistManager";
import { WishlistButton } from "@/components/wishlist/WishlistButton";

interface Book {
  id: string;
  name: string;
  description: string;
  author: string;
  price: number;
  coverImage: string | null;
  publishedAt: string;
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

export default function Home() {
  const { data: session, status } = useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth] = useState(() => {
    const now = new Date();
    return format(now, "MMMM yyyy");
  });

  // Admin state
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [adminSection, setAdminSection] = useState("dashboard");

  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, bannersRes] = await Promise.all([
          fetch("/api/books"),
          fetch("/api/banners"),
        ]);

        if (booksRes.ok) {
          const booksData = await booksRes.json();
          setBooks(booksData);
        }

        if (bannersRes.ok) {
          const bannersData = await bannersRes.json();
          setBanners(bannersData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAdminClick = () => {
    if (isAdmin) {
      setIsAdminMode(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setIsAdminMode(true);
  };

  const handleExitAdmin = () => {
    setIsAdminMode(false);
    setAdminSection("dashboard");
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setIsAdminMode(false);
  };

  // Admin Mode View
  if (isAdminMode && isAdmin) {
    return (
      <div className="h-screen flex bg-background">
        {/* Admin Sidebar */}
        <div className="hidden md:block self-stretch">
          <AdminSidebar
            activeSection={adminSection}
            onSectionChange={setAdminSection}
            onExitAdmin={handleExitAdmin}
          />
        </div>

        {/* Mobile Admin Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
          <div className="flex justify-around p-2">
            {["dashboard", "books", "banners", "users", "wishlists"].map((section) => (
              <button
                key={section}
                onClick={() => setAdminSection(section)}
                className={`flex flex-col items-center p-2 rounded-lg ${
                  adminSection === section
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {section === "dashboard" && <Skull className="h-5 w-5" />}
                {section === "books" && <Skull className="h-5 w-5" />}
                {section === "banners" && <Skull className="h-5 w-5" />}
                {section === "users" && <User className="h-5 w-5" />}
                {section === "wishlists" && <Skull className="h-5 w-5" />}
                <span className="text-xs mt-1 capitalize">{section}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Admin Content */}
        <div className="flex-1 overflow-auto pb-20 md:pb-0">
          {/* Top Bar */}
          <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={handleExitAdmin}
                >
                  <X className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold text-foreground capitalize">
                  {adminSection}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {session?.user?.email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-destructive border-destructive/30"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </header>

          {/* Section Content */}
          <main className="container mx-auto px-4 py-6">
            {adminSection === "dashboard" && <DashboardStats />}
            {adminSection === "books" && <BookManager />}
            {adminSection === "banners" && <BannerManager />}
            {adminSection === "users" && <UserManager />}
            {adminSection === "wishlists" && <WishlistManager />}
          </main>
        </div>
      </div>
    );
  }

  // Customer Mode View
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header currentPath="/" onAdminClick={handleAdminClick} onLoginClick={() => setShowAuthModal(true)} />

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
                      <div className="relative h-[300px] md:h-[450px] lg:h-[500px] w-full">
                        <Image
                          src={banner.imageUrl}
                          alt={banner.title}
                          fill
                          className="object-cover"
                          priority
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
                          <div className="max-w-xl">
                            <Badge className="mb-3 bg-primary/20 text-purple-light border-primary/30">
                              Featured
                            </Badge>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                              {banner.title}
                            </h2>
                            <p className="text-muted-foreground text-base md:text-lg mb-6">
                              {banner.subtitle}
                            </p>
                            <Button
                              size="lg"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground purple-glow"
                            >
                              Explore Now
                              <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))
                : // Fallback banners
                  [
                    {
                      id: "1",
                      image: "/images/banner1.png",
                      title: "New Arrivals This Week",
                      subtitle: "Discover the latest releases from top publishers",
                    },
                    {
                      id: "2",
                      image: "/images/banner2.png",
                      title: "Collector's Edition",
                      subtitle: "Limited edition variants and exclusive covers",
                    },
                    {
                      id: "3",
                      image: "/images/banner3.png",
                      title: "Membership Perks",
                      subtitle: "Join our loyalty program for exclusive discounts",
                    },
                  ].map((slide) => (
                    <CarouselItem key={slide.id}>
                      <div className="relative h-[300px] md:h-[450px] lg:h-[500px] w-full">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
                          <div className="max-w-xl">
                            <Badge className="mb-3 bg-primary/20 text-purple-light border-primary/30">
                              Featured
                            </Badge>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                              {slide.title}
                            </h2>
                            <p className="text-muted-foreground text-base md:text-lg mb-6">
                              {slide.subtitle}
                            </p>
                            <Button
                              size="lg"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground purple-glow"
                            >
                              Explore Now
                              <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
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

        {/* Books Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Skull className="h-6 w-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  This Month&apos;s Releases
                </h2>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {currentMonth}
              </p>
            </div>
            <Link href="/catalog">
              <Button
                variant="outline"
                className="border-primary/30 hover:bg-accent text-foreground"
              >
                View All Releases
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Books Grid */}
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
              <p className="text-muted-foreground text-lg">
                No books available for this month
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <Card
                  key={book.id}
                  className="group bg-card border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  {/* Book Cover */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={book.coverImage || "/images/banner1.png"}
                      alt={book.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                      New
                    </Badge>
                    <WishlistButton
                      bookId={book.id}
                      bookName={book.name}
                      variant="icon"
                      className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  <CardContent className="p-4">
                    {/* Title */}
                    <h3 className="font-bold text-foreground text-lg mb-1 line-clamp-1 group-hover:text-purple-light transition-colors">
                      {book.name}
                    </h3>

                    {/* Author */}
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-2">
                      <User className="h-3.5 w-3.5" />
                      <span className="line-clamp-1">{book.author}</span>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {book.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-1 text-primary font-bold">
                        <IndianRupee className="h-4 w-4" />
                        <span>{book.price.toLocaleString()}</span>
                      </div>
                      <WishlistButton
                        bookId={book.id}
                        bookName={book.name}
                        variant="ghost"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
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

            {/* Quick Links */}
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

            {/* Contact */}
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

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Purple Skull Comics Emporium. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
      <Toaster />
    </div>
  );
}
