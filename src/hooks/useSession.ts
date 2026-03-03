"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface SessionState {
  user: User | null;
  loading: boolean;
}

export function useSession() {
  const [session, setSession] = useState<SessionState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/session");
        const data = await response.json();
        setSession({
          user: data.user,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to fetch session:", error);
        setSession({
          user: null,
          loading: false,
        });
      }
    }

    fetchSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email,
          password,
        }),
      });

      if (response.ok) {
        // Refetch session
        const sessionResponse = await fetch("/api/session");
        const data = await sessionResponse.json();
        setSession({
          user: data.user,
          loading: false,
        });
        return { success: true };
      }

      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, error: "Failed to sign in" };
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      setSession({
        user: null,
        loading: false,
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return {
    ...session,
    signIn,
    signOut,
    isAdmin: session.user?.role === "ADMIN",
  };
}
