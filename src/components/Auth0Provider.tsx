"use client";

import { Auth0Provider } from "@auth0/auth0-react";

interface Auth0ProviderWrapperProps {
  children: React.ReactNode;
}

export function Auth0ProviderWrapper({ children }: Auth0ProviderWrapperProps) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
  const redirectUri = typeof window !== "undefined" ? window.location.origin : undefined;
  const audience = process.env.AUTH0_AUDIENCE;

  // Check for required Auth0 configuration
  if (!domain || !clientId) {
    console.warn(
      "[Auth0] Missing configuration. Please set in Vercel Dashboard → Settings → Environment Variables:\n" +
      "  - NEXT_PUBLIC_AUTH0_DOMAIN\n" +
      "  - NEXT_PUBLIC_AUTH0_CLIENT_ID\n" +
      "  - AUTH0_AUDIENCE (optional but recommended)\n" +
      "Auth0 authentication will be disabled until configured."
    );
    return <>{children}</>;
  }

  // Log configuration status in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Auth0] Configuration loaded:", {
      domain,
      clientId: clientId.substring(0, 8) + "...",
      audience: audience ? audience.substring(0, 30) + "..." : "not set",
      redirectUri,
    });
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience,
      }}
      cacheLocation="localstorage"
      onRedirectCallback={(appState) => {
        window.location.href = appState?.returnTo || "/";
      }}
    >
      {children}
    </Auth0Provider>
  );
}
