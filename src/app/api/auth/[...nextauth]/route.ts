import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, isAuthReady } from "@/lib/auth";

const handler = NextAuth(authOptions);

function authConfigurationError() {
  return NextResponse.json(
    {
      error:
        "Authentication is not configured yet. Add NEXTAUTH_SECRET and redeploy.",
    },
    { status: 503 },
  );
}

export const GET = isAuthReady ? handler : authConfigurationError;
export const POST = isAuthReady ? handler : authConfigurationError;
