"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist, wishlistApi } from "@/hooks/useWishlist";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

interface WishlistButtonProps {
  bookId: string;
  bookName?: string;
  variant?: "icon" | "button" | "ghost";
  className?: string;
  showText?: boolean;
}

export function WishlistButton({
  bookId,
  bookName,
  variant = "icon",
  className = "",
  showText = false,
}: WishlistButtonProps) {
  const { data: session } = useSession();
  const { items, addItem, removeItem, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const inWishlist = isInWishlist(bookId);

  const handleToggle = async () => {
    setIsLoading(true);

    try {
      if (session?.user) {
        // Logged in - sync with server
        if (inWishlist) {
          await wishlistApi.removeFromWishlist(bookId);
          removeItem(bookId);
          toast({
            title: "Removed from Wishlist",
            description: bookName
              ? `${bookName} has been removed from your wishlist`
              : "Item removed from your wishlist",
          });
        } else {
          const result = await wishlistApi.addToWishlist(bookId);
          addItem(result);
          toast({
            title: "Added to Wishlist",
            description: bookName
              ? `${bookName} has been added to your wishlist`
              : "Item added to your wishlist",
          });
        }
      } else {
        // Guest - local storage only
        if (inWishlist) {
          removeItem(bookId);
          toast({
            title: "Removed from Wishlist",
            description: bookName
              ? `${bookName} has been removed from your wishlist`
              : "Item removed from your wishlist",
          });
        } else {
          // Add as guest wishlist item
          addItem({
            id: `guest-${bookId}`,
            bookId,
            book: {
              id: bookId,
              name: bookName || "Unknown Book",
              price: 0,
              coverImage: null,
            },
          });
          toast({
            title: "Added to Wishlist",
            description: bookName
              ? `${bookName} has been added to your wishlist`
              : "Item added to your wishlist",
          });
        }
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        size="icon"
        variant="secondary"
        className={`${inWishlist ? "bg-primary/20 text-primary" : ""} ${className}`}
        onClick={handleToggle}
        disabled={isLoading}
        title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart
          className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`}
        />
      </Button>
    );
  }

  if (variant === "ghost") {
    return (
      <Button
        size="sm"
        variant="ghost"
        className={`h-8 px-2 ${inWishlist ? "bg-primary/10 text-primary" : "hover:bg-primary/10 hover:text-primary"} ${className}`}
        onClick={handleToggle}
        disabled={isLoading}
      >
        <Heart className={`h-4 w-4 mr-1 ${inWishlist ? "fill-current" : ""}`} />
        <span className="text-xs">{inWishlist ? "Wishlisted" : "Wishlist"}</span>
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      className={`gap-1 ${inWishlist ? "bg-primary/80" : "bg-primary hover:bg-primary/90"} ${className}`}
      onClick={handleToggle}
      disabled={isLoading}
    >
      <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
      {showText && (inWishlist ? "In Wishlist" : "Add to Wishlist")}
    </Button>
  );
}
