"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Camera, MapPin, MessageCircleHeart, Sparkles } from "lucide-react";

type Story = {
  id: string;
  title: string;
  location: string;
  country?: string | null;
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  bestSeason?: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  tags: string[];
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
};

type CommunityExperienceProps = {
  isAuthenticated: boolean;
};

const visibilityOptions = [
  { value: "PUBLIC", label: "Public" },
  { value: "COMMUNITY", label: "Community only" },
  { value: "PRIVATE", label: "Private draft style" },
] as const;

const initialForm = {
  title: "",
  location: "",
  country: "",
  coverImageUrl: "",
  bestSeason: "",
  tags: "",
  content: "",
  visibility: "PUBLIC",
};

export function CommunityExperience({ isAuthenticated }: CommunityExperienceProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [storyError, setStoryError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function loadStories() {
    setLoadingStories(true);
    setStoryError("");

    try {
      const response = await fetch("/api/stories?take=8", {
        method: "GET",
        cache: "no-store",
      });

      const payload = (await response.json()) as {
        stories?: Story[];
        warning?: string;
      };

      if (!response.ok) {
        setStoryError("Unable to load stories right now.");
        setLoadingStories(false);
        return;
      }

      setStories(payload.stories ?? []);
      if (payload.warning) {
        setStoryError(payload.warning);
      }
    } catch {
      setStoryError("Unable to load stories right now.");
    } finally {
      setLoadingStories(false);
    }
  }

  useEffect(() => {
    void loadStories();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setFormMessage("");

    const tags = form.tags
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 8);

    startTransition(async () => {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          location: form.location,
          country: form.country,
          coverImageUrl: form.coverImageUrl,
          bestSeason: form.bestSeason,
          content: form.content,
          tags,
          visibility: form.visibility,
          gallery: [],
        }),
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setFormError(payload.error ?? "Unable to publish your story.");
        return;
      }

      setFormMessage(payload.message ?? "Story published.");
      setForm(initialForm);
      void loadStories();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="mesh-card reveal rounded-[2rem] p-6 sm:p-7">
        <span className="section-kicker">Traveler community</span>
        <h3 className="mt-4 font-display text-4xl leading-none text-ink sm:text-5xl">
          Let travelers share beautiful places in their own words
        </h3>
        <p className="mt-4 text-base leading-8 text-stone">
          Registered users can publish location stories, tips, season notes, and
          photo links. This builds social trust and keeps your platform alive
          with real traveler experiences.
        </p>

        {!isAuthenticated ? (
          <div className="mt-7 rounded-[1.5rem] bg-white/75 p-5">
            <p className="text-sm leading-7 text-stone">
              Sign in first to publish your own travel story.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth/sign-up" className="primary-button">
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/auth/sign-in" className="secondary-button">
                Sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="story-title" className="mb-2 block text-sm font-medium text-ink">
                Story title
              </label>
              <input
                id="story-title"
                className="form-field"
                placeholder="Sunrise at Jermuk canyon"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="story-location" className="mb-2 block text-sm font-medium text-ink">
                  Location
                </label>
                <input
                  id="story-location"
                  className="form-field"
                  placeholder="Jermuk waterfall trail"
                  value={form.location}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, location: event.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="story-country" className="mb-2 block text-sm font-medium text-ink">
                  Country
                </label>
                <input
                  id="story-country"
                  className="form-field"
                  placeholder="Armenia"
                  value={form.country}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, country: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="story-cover" className="mb-2 block text-sm font-medium text-ink">
                  Cover image URL
                </label>
                <input
                  id="story-cover"
                  className="form-field"
                  placeholder="https://..."
                  value={form.coverImageUrl}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, coverImageUrl: event.target.value }))
                  }
                />
              </div>

              <div>
                <label htmlFor="story-season" className="mb-2 block text-sm font-medium text-ink">
                  Best season
                </label>
                <input
                  id="story-season"
                  className="form-field"
                  placeholder="Late spring"
                  value={form.bestSeason}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, bestSeason: event.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <label htmlFor="story-tags" className="mb-2 block text-sm font-medium text-ink">
                Tags (comma separated)
              </label>
              <input
                id="story-tags"
                className="form-field"
                placeholder="sunrise, hiking, wellness"
                value={form.tags}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, tags: event.target.value }))
                }
              />
            </div>

            <div>
              <label htmlFor="story-visibility" className="mb-2 block text-sm font-medium text-ink">
                Visibility
              </label>
              <select
                id="story-visibility"
                className="form-field"
                value={form.visibility}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, visibility: event.target.value }))
                }
              >
                {visibilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="story-content" className="mb-2 block text-sm font-medium text-ink">
                Story content
              </label>
              <textarea
                id="story-content"
                className="form-field min-h-36 resize-y"
                placeholder="Describe the place, mood, route tips, and what made it special."
                value={form.content}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, content: event.target.value }))
                }
                required
              />
            </div>

            {formError ? (
              <p className="rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-700">
                {formError}
              </p>
            ) : null}

            {formMessage ? (
              <p className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm text-emerald-700">
                {formMessage}
              </p>
            ) : null}

            <button className="primary-button w-full" type="submit" disabled={isPending}>
              {isPending ? "Publishing..." : "Publish story"}
              <Sparkles className="h-4 w-4" />
            </button>
          </form>
        )}
      </section>

      <section className="reveal reveal-delay-1 space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="section-kicker">Latest stories</span>
            <h3 className="mt-3 font-display text-4xl leading-none text-ink sm:text-5xl">
              Community feed
            </h3>
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={() => void loadStories()}
            disabled={loadingStories}
          >
            Refresh
          </button>
        </div>

        {storyError ? (
          <p className="rounded-2xl bg-amber-100 px-4 py-3 text-sm text-amber-800">
            {storyError}
          </p>
        ) : null}

        {loadingStories ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`story-skeleton-${index}`}
                className="story-card story-skeleton rounded-[1.75rem] p-5"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {stories.map((story, index) => (
              <article
                key={story.id}
                className={`story-card rounded-[1.75rem] p-5 reveal reveal-delay-${(index % 3) + 1}`}
              >
                <div className="overflow-hidden rounded-2xl border border-stone/10">
                  {story.coverImageUrl ? (
                    <img
                      src={story.coverImageUrl}
                      alt={story.title}
                      className="h-44 w-full object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-gradient-to-br from-sand/70 to-mist/60 text-stone">
                      <Camera className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <h4 className="mt-4 font-display text-3xl leading-none text-ink">
                  {story.title}
                </h4>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-stone">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-copper" />
                    {story.location}
                  </span>
                  <span>{story.country ?? "Travel story"}</span>
                </div>

                <p className="mt-3 text-sm leading-7 text-stone">
                  {story.excerpt || story.content.slice(0, 110)}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {story.tags.slice(0, 4).map((tag) => (
                    <span
                      key={`${story.id}-${tag}`}
                      className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-stone"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-stone/10 pt-3 text-sm text-stone">
                  <span>by {story.user.name ?? "Traveler"}</span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircleHeart className="h-4 w-4 text-copper" />
                    {story.likesCount}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
