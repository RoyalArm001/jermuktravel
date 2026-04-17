import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Smartphone,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";
import { CommunityExperience } from "@/components/community/community-experience";
import { CmsFeed } from "@/components/community/cms-feed";
import { InquiryForm } from "@/components/forms/inquiry-form";
import {
  getAuthConfigurationMessage,
  getSafeAuthSession,
  isAuthReady,
  isGoogleAuthEnabled,
} from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";

const valueCards = [
  {
    icon: Users,
    title: "Traveler-generated stories",
    description:
      "Registered users can post locations, notes, and photo links from beautiful places.",
  },
  {
    icon: WandSparkles,
    title: "Editorial + community together",
    description:
      "WordPress CMS can power curated guides, while app database stores user stories.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first experience",
    description:
      "Cards, feed, and forms are designed to feel natural on phones before desktop.",
  },
] as const;

const mobileHighlights = [
  "Thumb-friendly spacing and full-width action buttons on smaller screens",
  "Horizontal snap cards for story browsing on mobile",
  "Smooth reveal and floating animations without heavy motion overload",
] as const;

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <span className="section-kicker">{eyebrow}</span>
      <h2 className="font-display text-4xl leading-none text-ink sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      <p className="text-base leading-8 text-stone sm:text-lg">{description}</p>
    </div>
  );
}

export default async function Home() {
  const session = await getSafeAuthSession();
  const primaryHref = session?.user ? "#community" : "/auth/sign-up";
  const primaryLabel = session?.user ? "Share your story" : "Create account";

  return (
    <main className="relative overflow-hidden">
      <div className="orb orb-warm" />
      <div className="orb orb-cool" />
      <div className="orb orb-mist" />

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-5 sm:px-8 lg:px-10">
        <header className="glass-card reveal sticky top-3 z-20 flex flex-col gap-4 rounded-[1.6rem] px-4 py-4 sm:rounded-[2rem] sm:px-5 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/" className="font-display text-3xl tracking-[0.08em] text-ink">
              Jermuk Travel
            </Link>
            <p className="mt-1 text-sm text-stone">
              Social travel platform for stories, not just static pages.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-stone sm:gap-3">
            <a href="#community" className="rounded-full px-3 py-2 transition hover:bg-white/50">
              Community
            </a>
            <a href="#cms" className="rounded-full px-3 py-2 transition hover:bg-white/50">
              CMS
            </a>
            <a href="#planner" className="rounded-full px-3 py-2 transition hover:bg-white/50">
              Planner
            </a>
            <Link href={session?.user ? "/account" : "/auth/sign-in"} className="primary-button">
              {session?.user ? "Account" : "Sign in"}
            </Link>
          </nav>
        </header>

        <div className="grid gap-8 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="space-y-7 reveal reveal-delay-1">
            <span className="section-kicker">New Product Direction</span>
            <h1 className="display-balance font-display text-5xl leading-[0.92] text-ink sm:text-6xl lg:text-[5.4rem]">
              Turn your site into a place where travelers share real moments.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-stone sm:text-xl">
              This is now structured as a social-travel experience: users
              register, post their beautiful place discoveries, and your team
              can still run editorial content via WordPress CMS.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={primaryHref} className="primary-button">
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#cms" className="secondary-button">
                Connect WordPress
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <article className="glass-card rounded-[1.35rem] p-4">
                <p className="font-display text-3xl text-ink">UGC</p>
                <p className="mt-1 text-sm leading-6 text-stone">
                  Stories from registered travelers
                </p>
              </article>
              <article className="glass-card rounded-[1.35rem] p-4">
                <p className="font-display text-3xl text-ink">WP CMS</p>
                <p className="mt-1 text-sm leading-6 text-stone">
                  Editorial guides from WordPress
                </p>
              </article>
              <article className="glass-card rounded-[1.35rem] p-4">
                <p className="font-display text-3xl text-ink">Mobile</p>
                <p className="mt-1 text-sm leading-6 text-stone">
                  Optimized interactions on phones
                </p>
              </article>
            </div>
          </div>

          <div className="mesh-card reveal reveal-delay-2 rounded-[2rem] p-6 sm:p-7">
            <span className="section-kicker">What changed</span>
            <h2 className="mt-4 font-display text-4xl leading-none text-ink sm:text-5xl">
              Built for sharing, not only booking
            </h2>
            <div className="mt-6 grid gap-4">
              {valueCards.map((item, index) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className={`glass-card rounded-[1.45rem] p-4 reveal reveal-delay-${(index % 3) + 1}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-olive/10 text-olive">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-stone">{item.description}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
                Auth status
              </p>
              <p className="mt-2 text-sm leading-7 text-ink">
                {session?.user
                  ? `Signed in as ${session.user.email ?? "traveler"}`
                  : "Visitors can register now, then publish place stories."}
              </p>
              <p className="mt-2 text-sm leading-7 text-stone">
                {!isDatabaseConfigured
                  ? "The site is running in public demo mode until the production database is connected."
                  : !isAuthReady
                  ? getAuthConfigurationMessage()
                  : isGoogleAuthEnabled
                  ? "Google sign-in is enabled."
                  : "Add Google OAuth keys in .env to enable Google sign-in."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-8 lg:px-10">
        <div className="mesh-card reveal rounded-[2rem] px-5 py-6 sm:px-8 sm:py-8">
          <SectionHeading
            eyebrow="Mobile UX polish"
            title="Animations and layout are tuned for phone-first browsing."
            description="The community cards use soft reveal transitions and swipe-friendly feed behavior. Buttons, fields, and key actions remain easy to tap on small screens."
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {mobileHighlights.map((item, index) => (
              <article
                key={item}
                className={`glass-card rounded-[1.45rem] p-4 reveal reveal-delay-${(index % 3) + 1}`}
              >
                <p className="text-sm leading-7 text-stone">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Community"
          title="Users can now publish their own place stories"
          description="This section is backed by API + database models for story posts, tags, media, and engagement counters."
        />
        <div className="mt-7">
          <CommunityExperience isAuthenticated={Boolean(session?.user)} />
        </div>
      </section>

      <section id="cms" className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="WordPress integration"
          title="CMS posts can appear alongside traveler stories"
          description="Use WordPress for curated destination guides, announcements, and long-form content while user stories stay in your app database."
        />
        <div className="mt-7">
          <CmsFeed />
        </div>
      </section>

      <section id="planner" className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="mesh-card reveal rounded-[2rem] p-6 sm:p-7">
            <span className="section-kicker">Operations panel</span>
            <h3 className="mt-4 font-display text-4xl leading-none text-ink sm:text-5xl">
              Keep inquiry capture for sales and concierge work
            </h3>
            <p className="mt-4 text-base leading-8 text-stone">
              Community sharing and business inquiries can live together. The
              form on the right still saves planning requests for your team.
            </p>

            <div className="mt-6 space-y-3">
              <div className="glass-card rounded-[1.4rem] p-4">
                <p className="text-sm leading-7 text-stone">
                  <BadgeCheck className="mr-2 inline h-4 w-4 text-copper" />
                  Secure auth with hashed passwords
                </p>
              </div>
              <div className="glass-card rounded-[1.4rem] p-4">
                <p className="text-sm leading-7 text-stone">
                  <Camera className="mr-2 inline h-4 w-4 text-copper" />
                  Travelers share places with photo URLs and local tips
                </p>
              </div>
              <div className="glass-card rounded-[1.4rem] p-4">
                <p className="text-sm leading-7 text-stone">
                  <Sparkles className="mr-2 inline h-4 w-4 text-copper" />
                  WordPress REST feed ready via env config
                </p>
              </div>
            </div>
          </div>

          <InquiryForm />
        </div>
      </section>

      <footer className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-4 text-sm text-stone sm:px-8 lg:px-10">
        <div className="glass-card flex flex-col gap-4 rounded-[1.8rem] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <p>
            Community-ready Jermuk platform: traveler stories, CMS bridge,
            secure auth, and database-backed growth path.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/auth/sign-up" className="secondary-button">
              Join community
            </Link>
            <Link href="/account" className="secondary-button">
              My account
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
