"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Auth0ProviderWrapper } from "./Auth0Provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Auth0ProviderWrapper>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </SessionProvider>
    </Auth0ProviderWrapper>
  );
}
