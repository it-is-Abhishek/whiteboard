// Convex Auth Configuration for Clerk
// See https://docs.convex.dev/auth/clerk for more details
//
// 1. Create a Clerk JWT Template in your Clerk Dashboard:
//    - Go to JWT Templates > Create New Template
//    - Add "convex" to the "Aud" (audience) claim
//    - Copy the JWKS endpoint URL
//
// 2. Configure CLERK_JWT_ISSUER_DOMAIN in your Convex Dashboard
//    with the domain from your Clerk JWT template (e.g., your-domain.clerk.accounts.dev)

export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || "https://new-vulture-51.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};

