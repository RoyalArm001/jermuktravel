import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import {
  getSafeAuthSession,
  isAuthReady,
  isGoogleAuthEnabled,
} from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";

export default async function SignUpPage() {
  const session = await getSafeAuthSession();

  if (session?.user) {
    redirect("/account");
  }

  return (
    <AuthShell
      title="Create a secure traveler record"
      description="Register travelers with a proper backend foundation so future bookings, inquiries, and saved details stay attached to one profile."
      alternateHref="/auth/sign-in"
      alternateLabel="Sign in"
      alternateText="Already have an account?"
      googleEnabled={isGoogleAuthEnabled}
    >
      {isAuthReady ? (
        <SignUpForm googleEnabled={isGoogleAuthEnabled} />
      ) : (
        <div>
          <span className="section-kicker">Environment setup needed</span>
          <h2 className="mt-4 font-display text-5xl leading-none text-ink">
            Registration is disabled for now
          </h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-stone">
            {isDatabaseConfigured
              ? "Add a `NEXTAUTH_SECRET` value and redeploy when you are ready to enable accounts."
              : "Connect the production database first, then add `NEXTAUTH_SECRET` when you are ready to enable accounts."}
          </p>
        </div>
      )}
    </AuthShell>
  );
}
