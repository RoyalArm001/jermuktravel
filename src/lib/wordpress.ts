export type CmsPost = {
  id: number;
  title: string;
  excerpt: string;
  url: string;
  date: string;
  featuredImageUrl?: string;
};

type WordPressRestPost = {
  id: number;
  date: string;
  link: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
    }>;
  };
};

const cmsBaseUrl = process.env.WORDPRESS_API_URL?.trim().replace(/\/+$/, "");
const cmsUser = process.env.WORDPRESS_API_USER?.trim();
const cmsPassword = process.env.WORDPRESS_API_APP_PASSWORD?.trim();

export const isWordPressConfigured = Boolean(cmsBaseUrl);

function stripHtml(input?: string) {
  return (input ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(input: string) {
  return input
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, "\"")
    .replace(/&#8221;/g, "\"")
    .replace(/&#038;/g, "&")
    .replace(/&#8230;/g, "...")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function toCmsPost(post: WordPressRestPost): CmsPost {
  return {
    id: post.id,
    title: decodeEntities(stripHtml(post.title?.rendered)) || "Untitled post",
    excerpt: decodeEntities(stripHtml(post.excerpt?.rendered)),
    url: post.link,
    date: post.date,
    featuredImageUrl: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
  };
}

export async function fetchWordPressPosts(limit = 4): Promise<CmsPost[]> {
  if (!cmsBaseUrl) {
    return [];
  }

  const endpoint = `${cmsBaseUrl}/wp-json/wp/v2/posts?per_page=${Math.min(
    Math.max(limit, 1),
    10,
  )}&_embed=wp:featuredmedia`;

  const headers: HeadersInit = {};

  if (cmsUser && cmsPassword) {
    const token = Buffer.from(`${cmsUser}:${cmsPassword}`).toString("base64");
    headers.Authorization = `Basic ${token}`;
  }

  const response = await fetch(endpoint, {
    headers,
    next: {
      revalidate: 180,
    },
  });

  if (!response.ok) {
    throw new Error(`WordPress API error ${response.status}`);
  }

  const payload = (await response.json()) as WordPressRestPost[];
  return payload.map(toCmsPost);
}
