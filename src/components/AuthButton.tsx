"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Loader2 } from "lucide-react";

interface AuthButtonProps {
  onLoginClick?: () => void;
}

export function AuthButton({ onLoginClick }: AuthButtonProps) {
  const {
    isAuthenticated,
    isLoading,
    error,
    loginWithRedirect,
    logout,
  } = useAuth0();

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (error) {
    console.error("Auth0 error:", error);
    return (
      <Button variant="outline" size="sm" className="text-red-500">
        {error.message}
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const returnTo = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
          logout({ logoutParams: { returnTo } });
        }}
      >
        <LogOut className="h-4 w-4 mr-1" />
        Sign Out
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: "signup" } })}
      className="border-primary/30 text-primary hover:bg-primary/10"
    >
      <LogIn className="h-4 w-4 mr-1" />
      Login
    </Button>
  );
}
