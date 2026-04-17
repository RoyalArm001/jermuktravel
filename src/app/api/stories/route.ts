import { Prisma, StoryStatus, StoryVisibility } from "@prisma/client";
import { NextResponse } from "next/server";
import { getSafeAuthSession } from "@/lib/auth";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { createStorySchema } from "@/lib/validators";

type StoryQueryResult = Prisma.PlaceStoryGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    tags: {
      include: {
        tag: true;
      };
    };
    media: true;
  };
}>;

const FALLBACK_STORIES = [
  {
    id: "sample-1",
    title: "Sunrise above Jermuk canyon",
    location: "Jermuk Canyon",
    country: "Armenia",
    excerpt:
      "Early morning fog opened over the canyon and the trail felt almost cinematic.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
    content:
      "The first light hit the ridge line right before 7am. If you visit, bring a windproof layer and warm tea.",
    bestSeason: "Late spring",
    likesCount: 18,
    commentsCount: 3,
    createdAt: new Date().toISOString(),
    user: {
      id: "sample-user-1",
      name: "Demo Traveler",
      image: null,
    },
    tags: ["sunrise", "canyon", "wellness"],
    media: [],
  },
  {
    id: "sample-2",
    title: "Mineral pool evening ritual",
    location: "Jermuk Spa District",
    country: "Armenia",
    excerpt:
      "Warm pool session after a long hike; perfect balance for a recovery day.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    content:
      "We booked the last hour before close and the place was quiet. Great time for couples and solo recovery.",
    bestSeason: "All year",
    likesCount: 31,
    commentsCount: 6,
    createdAt: new Date().toISOString(),
    user: {
      id: "sample-user-2",
      name: "Sample Guest",
      image: null,
    },
    tags: ["spa", "mineral-water", "slowtravel"],
    media: [],
  },
] as const;

function normalizeTags(tags: string[]) {
  const unique = new Set<string>();

  for (const tag of tags) {
    const normalized = tag.trim().toLowerCase();

    if (!normalized) {
      continue;
    }

    unique.add(normalized.slice(0, 32));
  }

  return Array.from(unique).slice(0, 8);
}

async function createUniqueSlug(baseInput: string) {
  const base = slugify(baseInput) || "story";

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const suffix = attempt === 0 ? "" : `-${Math.floor(1000 + Math.random() * 9000)}`;
    const candidate = `${base}${suffix}`;
    const exists = await prisma.placeStory.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!exists) {
      return candidate;
    }
  }

  return `${base}-${Date.now().toString().slice(-6)}`;
}

function formatStory(story: StoryQueryResult) {
  return {
    id: story.id,
    title: story.title,
    location: story.location,
    country: story.country,
    excerpt: story.excerpt,
    content: story.content,
    coverImageUrl: story.coverImageUrl,
    bestSeason: story.bestSeason,
    likesCount: story.likesCount,
    commentsCount: story.commentsCount,
    createdAt: story.createdAt.toISOString(),
    user: story.user,
    tags: story.tags.map((item) => item.tag.label),
    media: story.media.map((item) => ({
      id: item.id,
      imageUrl: item.imageUrl,
      caption: item.caption,
      sortOrder: item.sortOrder,
    })),
  };
}

export async function GET(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json({
      stories: FALLBACK_STORIES,
      source: "fallback",
      warning: "Database is not connected yet. Showing sample stories.",
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const takeParam = Number(searchParams.get("take") ?? "8");
    const take = Number.isFinite(takeParam)
      ? Math.min(Math.max(Math.floor(takeParam), 1), 20)
      : 8;

    const stories = await prisma.placeStory.findMany({
      where: {
        status: StoryStatus.PUBLISHED,
        visibility: {
          in: [StoryVisibility.PUBLIC, StoryVisibility.COMMUNITY],
        },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        media: {
          orderBy: {
            sortOrder: "asc",
          },
          take: 4,
        },
      },
    });

    if (stories.length === 0) {
      return NextResponse.json({
        stories: FALLBACK_STORIES,
        source: "fallback",
      });
    }

    return NextResponse.json({
      stories: stories.map(formatStory),
      source: "database",
    });
  } catch {
    return NextResponse.json({
      stories: FALLBACK_STORIES,
      source: "fallback",
      warning: "Database is not ready yet. Showing sample stories.",
    });
  }
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      {
        error:
          "Story publishing is not available yet. Connect the database first, then try again.",
      },
      { status: 503 },
    );
  }

  const session = await getSafeAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        error: "Please sign in to share a story.",
      },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as unknown;
    const parsed = createStorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message ?? "Invalid story data.",
        },
        { status: 400 },
      );
    }

    const tags = normalizeTags(parsed.data.tags);
    const slug = await createUniqueSlug(parsed.data.title);

    const createdStory = await prisma.placeStory.create({
      data: {
        userId: session.user.id,
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt,
        location: parsed.data.location,
        country: parsed.data.country,
        coverImageUrl:
          parsed.data.coverImageUrl ?? parsed.data.gallery[0]?.imageUrl ?? undefined,
        content: parsed.data.content,
        bestSeason: parsed.data.bestSeason,
        visibility: parsed.data.visibility,
        status: StoryStatus.PUBLISHED,
        media: parsed.data.gallery.length
          ? {
              create: parsed.data.gallery.map((item, index) => ({
                imageUrl: item.imageUrl,
                caption: item.caption,
                sortOrder: index,
              })),
            }
          : undefined,
        tags: tags.length
          ? {
              create: tags.map((tagLabel) => ({
                tag: {
                  connectOrCreate: {
                    where: { slug: slugify(tagLabel) || tagLabel },
                    create: {
                      slug: slugify(tagLabel) || tagLabel,
                      label: tagLabel,
                    },
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        media: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Story published successfully.",
        story: formatStory(createdStory),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Story publishing is not available yet. Connect the database first, then try again.",
      },
      { status: 503 },
    );
  }
}
