import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import {
  getSafeAuthSession,
  isAuthReady,
  isGoogleAuthEnabled,
} from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";

export default async function SignInPage() {
  const session = await getSafeAuthSession();

  if (session?.user) {
    redirect("/account");
  }

  return (
    <AuthShell
      title="Sign in to continue planning"
      description="Use the secure traveler login to access your account, track future bookings, and keep communication attached to the right guest profile."
      alternateHref="/auth/sign-up"
      alternateLabel="Create one"
      alternateText="Need a new account?"
      googleEnabled={isGoogleAuthEnabled}
    >
      {isAuthReady ? (
        <SignInForm googleEnabled={isGoogleAuthEnabled} />
      ) : (
        <div>
          <span className="section-kicker">Environment setup needed</span>
          <h2 className="mt-4 font-display text-5xl leading-none text-ink">
            Sign in is disabled for now
          </h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-stone">
            {isDatabaseConfigured
              ? "Add a `NEXTAUTH_SECRET` value and redeploy when you are ready to turn authentication on."
              : "Connect the production database first, then add `NEXTAUTH_SECRET` when you are ready to turn authentication on."}
          </p>
        </div>
      )}
    </AuthShell>
  );
}
