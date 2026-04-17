import { NextResponse } from "next/server";
import { fetchWordPressPosts, isWordPressConfigured } from "@/lib/wordpress";

const fallbackPosts = [
  {
    id: 1,
    title: "How to set up your first Jermuk travel guide in WordPress",
    excerpt:
      "Connect your WordPress API and let this section show your latest editorial posts automatically.",
    url: "#",
    date: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Editorial and community content can live together",
    excerpt:
      "Use WordPress for curated guides and this app database for traveler-generated stories.",
    url: "#",
    date: new Date().toISOString(),
  },
] as const;

export async function GET() {
  if (!isWordPressConfigured) {
    return NextResponse.json({
      configured: false,
      source: "fallback",
      posts: fallbackPosts,
      message:
        "WORDPRESS_API_URL is missing. Add it to .env to pull real CMS posts.",
    });
  }

  try {
    const posts = await fetchWordPressPosts(4);

    if (!posts.length) {
      return NextResponse.json({
        configured: true,
        source: "empty",
        posts: fallbackPosts,
        message: "CMS connected but no posts were returned.",
      });
    }

    return NextResponse.json({
      configured: true,
      source: "wordpress",
      posts,
    });
  } catch {
    return NextResponse.json(
      {
        configured: true,
        source: "fallback",
        posts: fallbackPosts,
        message: "Unable to reach WordPress API. Showing fallback CMS cards.",
      },
      { status: 502 },
    );
  }
}
