"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { ExternalLink, Newspaper } from "lucide-react";

type CmsPost = {
  id: number;
  title: string;
  excerpt: string;
  url: string;
  date: string;
  featuredImageUrl?: string;
};

type CmsApiResponse = {
  configured: boolean;
  source: "wordpress" | "fallback" | "empty";
  posts: CmsPost[];
  message?: string;
};

export function CmsFeed() {
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCmsPosts() {
      setLoading(true);

      try {
        const response = await fetch("/api/cms/posts", {
          method: "GET",
          cache: "no-store",
        });

        const payload = (await response.json()) as CmsApiResponse;
        setPosts(payload.posts ?? []);
        setMessage(payload.message ?? "");
      } catch {
        setMessage("Unable to load CMS posts right now.");
      } finally {
        setLoading(false);
      }
    }

    void loadCmsPosts();
  }, []);

  return (
    <section className="reveal reveal-delay-1">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <span className="section-kicker">WordPress bridge</span>
          <h3 className="mt-3 font-display text-4xl leading-none text-ink sm:text-5xl">
            CMS editorial feed
          </h3>
        </div>
      </div>

      {message ? (
        <p className="mb-4 rounded-2xl bg-amber-100 px-4 py-3 text-sm text-amber-800">
          {message}
        </p>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`cms-skeleton-${index}`}
              className="story-card story-skeleton rounded-[1.65rem] p-5"
            />
          ))}
        </div>
      ) : (
        <div className="no-scrollbar -mx-2 flex snap-x gap-4 overflow-x-auto px-2 pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className={`story-card min-w-[78%] snap-center rounded-[1.65rem] p-5 sm:min-w-[52%] lg:min-w-0 reveal reveal-delay-${(index % 3) + 1}`}
            >
              <div className="overflow-hidden rounded-2xl border border-stone/10">
                {post.featuredImageUrl ? (
                  <img
                    src={post.featuredImageUrl}
                    alt={post.title}
                    className="h-36 w-full object-cover transition duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-sand/70 to-mist/60 text-stone">
                    <Newspaper className="h-8 w-8" />
                  </div>
                )}
              </div>

              <h4 className="mt-4 font-display text-2xl leading-none text-ink">
                {post.title}
              </h4>
              <p className="mt-3 text-sm leading-7 text-stone">
                {post.excerpt || "Open the post to view full content."}
              </p>

              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-button mt-4 w-full"
              >
                Open post
                <ExternalLink className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
