import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { securityNotes } from "@/lib/site-content";

type AuthShellProps = {
  title: string;
  description: string;
  alternateHref: string;
  alternateLabel: string;
  alternateText: string;
  googleEnabled: boolean;
  children: ReactNode;
};

export function AuthShell({
  title,
  description,
  alternateHref,
  alternateLabel,
  alternateText,
  googleEnabled,
  children,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <div className="orb orb-warm" />
      <div className="orb orb-cool" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-stone transition hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to homepage
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="mesh-card rounded-[2.5rem] p-8 sm:p-10">
            <span className="section-kicker">Secure traveler access</span>
            <h1 className="mt-5 font-display text-6xl leading-[0.94] text-ink">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-stone">
              {description}
            </p>

            <div className="mt-8 rounded-[1.75rem] bg-white/72 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-stone/80">
                Environment status
              </p>
              <p className="mt-3 text-lg leading-8 text-ink">
                {googleEnabled
                  ? "Google sign-in is enabled in this environment."
                  : "Google sign-in is ready in code. Add client keys to .env to turn it on."}
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              {securityNotes.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="glass-card rounded-[1.6rem] p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-olive/10 text-olive">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-ink">{item.title}</h2>
                        <p className="mt-2 text-sm leading-7 text-stone">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="glass-card rounded-[2.5rem] p-8 sm:p-10">
            {children}
            <p className="mt-6 text-sm leading-7 text-stone">
              {alternateText}{" "}
              <Link href={alternateHref} className="font-semibold text-olive">
                {alternateLabel}
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
