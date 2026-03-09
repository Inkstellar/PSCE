// Auth0 Integration Guide for Purple Skull Comics
// =============================================

// Configuration (.env)
// --------------------
// The following environment variables have been added to .env:
//
// NEXT_PUBLIC_AUTH0_DOMAIN=dev-n4bs67ejovd8ob3l.us.auth0.com
// NEXT_PUBLIC_AUTH0_CLIENT_ID=fI3aohfCivvqlZqqfozs2DBCoqb2B4Hz

// Usage in Components
// -------------------
// Import and use the useAuth0 hook in any client component:

import { useAuth0 } from "@auth0/auth0-react";

function MyComponent() {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return isAuthenticated ? (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Sign Out
      </button>
    </div>
  ) : (
    <button onClick={() => loginWithRedirect()}>
      Sign In with Auth0
    </button>
  );
}

// Quick Login Functions
// ---------------------
// Login with signup hint:
// loginWithRedirect({ authorizationParams: { screen_hint: "signup" } })

// Login with specific audience:
// loginWithRedirect({ authorizationParams: { audience: "https://your-api-identifier" } })

// Protected API Calls
// -------------------
// Use the access token for authenticated API calls:
async function callProtectedAPI() {
  const token = await getAccessTokenSilently();
  
  const response = await fetch("/api/protected", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.json();
}

// Notes
// -----
// - Auth0Provider is already wrapped in src/components/Providers.tsx
// - The existing NextAuth.js authentication still works alongside Auth0
// - For production, add AUTH0_AUDIENCE and AUTH0_CALLBACK_URL to .env

// Architecture Notes
// -----------------
// IMPORTANT: This application currently runs both NextAuth.js AND Auth0 simultaneously
// without synchronization. This creates confusion and potential security issues.

// Current State
// - NextAuth.js handles authentication via src/app/api/auth/[...nextauth]/route.ts
// - Auth0 handles authentication via the Auth0Provider and useAuth0() hook
// - These two systems are independent and do NOT share session data

// Key Concern
// Users authenticated via Auth0 will NOT have a NextAuth session, and users
// authenticated via NextAuth will NOT appear as authenticated to Auth0.
// This means:
//   - Components using useAuth0() won't recognize NextAuth users
//   - Components using useSession() won't recognize Auth0 users
//   - Protected routes using one system won't protect against users
//     authenticated only through the other system

// Recommendation for Production
// Choose ONE authentication system:

// Option A: Use Auth0 as the Primary System (Recommended)
// 1. Remove or disable NextAuth.js by removing src/app/api/auth/[...nextauth]
// 2. Alternatively, configure NextAuth to use Auth0 as an OAuth provider:
//    - This consolidates both systems into one
//    - Use Auth0 as a provider in NextAuth config
//    - This gives you NextAuth session management while using Auth0 for auth
// 3. Update all components to consistently use either useAuth0() OR useSession()

// Option B: Use NextAuth.js as the Primary System
// 1. Remove Auth0Provider from src/components/Providers.tsx
// 2. Remove Auth0-related components (Auth0Provider.tsx, AuthButton.tsx)
// 3. Use NextAuth for all authentication (it can still use Auth0 as a provider)

// Option C: Keep Both Systems (Not Recommended)
// If you must keep both, you MUST document which routes/components use which system:
//   - Auth0 routes/components: Those using useAuth0(), Auth0Provider
//   - NextAuth routes/components: Those using useSession(), [...nextauth]
//   - Add clear comments in each protected area indicating which auth system is used
//   - Implement separate middleware for each system's protected routes

// For New Implementations: Consider using NextAuth with Auth0 as an OAuth provider.
// This provides a unified session management experience while leveraging Auth0's
// authentication infrastructure.
