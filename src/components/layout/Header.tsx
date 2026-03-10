"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Heart,
  Shield,
  Menu,
  LogIn,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useWishlist, wishlistApi } from "@/hooks/useWishlist";
import { signOut } from "next-auth/react";

interface HeaderProps {
  currentPath?: string;
  onAdminClick?: () => void;
}

export function Header({ currentPath = "/", onAdminClick }: HeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = session?.user?.role === "ADMIN";
  const isLoggedIn = !!session?.user;
  const { items, setItems } = useWishlist();
  const wishlistCount = items.length;

  // Fetch wishlist from server if logged in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (session?.user) {
        try {
          const wishlistItems = await wishlistApi.fetchWishlist();
          setItems(wishlistItems);
        } catch (error) {
          console.error("Failed to fetch wishlist:", error);
        }
      }
    };

    fetchWishlist();
  }, [session?.user, setItems]);

  const navItems = [
    { href: "/", label: "Home", active: currentPath === "/" },
    { href: "/catalog", label: "Catalog", active: currentPath === "/catalog" },
    { href: "/about", label: "About", active: currentPath === "/about" },
  ];

  const handleAdminClick = () => {
    setMobileMenuOpen(false);
    if (onAdminClick) {
      onAdminClick();
    }
  };

  const handleLoginClick = () => {
    setMobileMenuOpen(false);
    // Redirect to login page with return URL
    const returnUrl = encodeURIComponent(window.location.pathname);
    router.push(`/login?returnUrl=${returnUrl}`);
  };

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut({ redirect: false });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 md:w-14 md:h-14 overflow-hidden rounded-lg purple-glow">
              <Image
                src="/images/logo.png"
                alt="Purple Skull Comics Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-purple-light tracking-tight">
                Purple Skull
              </span>
              <span className="text-xs md:text-sm text-muted-foreground font-medium">
                Comics Emporium
              </span>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  item.active
                    ? "text-purple-light"
                    : "text-foreground/80 hover:text-purple-light"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent"
              title="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs flex items-center justify-center text-primary-foreground font-bold">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Button>
            {/* Auth Buttons */}
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAdminClick}
                    className="hidden sm:flex border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Admin
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="hidden sm:flex"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoginClick}
                className="hidden sm:flex border-primary/30 text-primary hover:bg-primary/10"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </Button>
            )}
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-border mt-3">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    item.active
                      ? "text-purple-light"
                      : "text-foreground/80 hover:text-purple-light"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <button
                      onClick={handleAdminClick}
                      className="flex items-center gap-2 text-sm font-medium text-primary text-left"
                    >
                      <Shield className="h-4 w-4" />
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="flex items-center gap-2 text-sm font-medium text-primary text-left"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
