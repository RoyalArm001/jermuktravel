import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getSafeAuthSession, isGoogleAuthEnabled } from "@/lib/auth";

const accountHighlights = [
  {
    icon: BadgeCheck,
    title: "Traveler account active",
    description:
      "This account can now be used as the base record for future bookings and inquiry history.",
  },
  {
    icon: ShieldCheck,
    title: "Secure login design",
    description:
      "Email passwords are stored as hashes, while Google passwords are never stored at all.",
  },
  {
    icon: Sparkles,
    title: "Ready for next phase",
    description:
      "The database already includes destinations, tour packages, and inquiry models for the content/admin stage.",
  },
] as const;

export default async function AccountPage() {
  const session = await getSafeAuthSession();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <div className="orb orb-warm" />
      <div className="orb orb-cool" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="glass-card rounded-[2.5rem] p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <span className="section-kicker">Traveler account</span>
              <h1 className="mt-4 font-display text-6xl leading-[0.94] text-ink">
                {session.user.name ?? "Welcome back"}
              </h1>
              <p className="mt-4 text-lg leading-8 text-stone">
                {session.user.email ?? "Signed-in traveler"} is now attached to
                the authentication layer for this project.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="secondary-button">
                Back to homepage
              </Link>
              <SignOutButton />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {accountHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="mesh-card rounded-[1.75rem] p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-olive/10 text-olive">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-ink">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-stone">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <article className="glass-card rounded-[1.75rem] p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-stone/80">
                Current role
              </p>
              <p className="mt-3 text-lg text-ink">{session.user.role}</p>
            </article>

            <article className="glass-card rounded-[1.75rem] p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-stone/80">
                Google sign-in
              </p>
              <p className="mt-3 text-lg text-ink">
                {isGoogleAuthEnabled
                  ? "Configured and ready in this environment."
                  : "Code is ready. Add Google OAuth keys to enable it."}
              </p>
            </article>
          </div>
        </div>
      </div>
    </main>
  );
}
