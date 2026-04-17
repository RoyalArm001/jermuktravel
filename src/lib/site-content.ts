import type { LucideIcon } from "lucide-react";
import {
  CalendarRange,
  Compass,
  HeartPulse,
  Hotel,
  Leaf,
  MapPinned,
  Mountain,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export type IconCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const heroStats = [
  {
    value: "4-season",
    label: "Positioning for spa escapes, forest walks, and alpine slow travel.",
  },
  {
    value: "2 auth paths",
    label: "Email/password registration today, Google sign-in when keys are added.",
  },
  {
    value: "1 database",
    label: "Separate PostgreSQL layer for users, inquiries, destinations, and packages.",
  },
] as const;

export const securityNotes: IconCard[] = [
  {
    icon: ShieldCheck,
    title: "Passwords stay hashed",
    description:
      "Credentials-based accounts are stored with bcrypt hashes, never as plain-text passwords.",
  },
  {
    icon: Sparkles,
    title: "Google sign-in ready",
    description:
      "The auth layer already supports Google. You only need to add the client keys in the environment file.",
  },
  {
    icon: Users,
    title: "Separate travel database",
    description:
      "Users, inquiries, destinations, and future packages are designed to live in their own PostgreSQL data model.",
  },
];

export const journeys = [
  {
    icon: HeartPulse,
    tag: "Wellness",
    title: "Mineral reset weekends",
    description:
      "Ideal for guests coming to Jermuk for spa rituals, thermal water access, quiet evenings, and recovery-first pacing.",
    highlights: [
      "Spa hotel orientation and arrival-night calm",
      "Mineral-water rituals paired with flexible meal plans",
      "A softer, premium tone for couples and solo guests",
    ],
  },
  {
    icon: Mountain,
    tag: "Nature",
    title: "Canyon and mountain air",
    description:
      "A stronger outdoor story for travelers who want viewpoints, forest drives, waterfalls, and scenic pauses without losing comfort.",
    highlights: [
      "Day plans built around Jermuk canyon scenery",
      "Easy framing for private transfers and local guides",
      "Space for seasonal adventure content later",
    ],
  },
  {
    icon: Hotel,
    tag: "Private groups",
    title: "Curated stay planning",
    description:
      "Structured for travel coordinators who need an elegant way to save guests, receive inquiries, and prepare custom packages.",
    highlights: [
      "Guest registration before the sales conversation",
      "Inquiry capture tied to the future CRM flow",
      "Easy expansion toward rooms, tours, and availability",
    ],
  },
] as const;

export const wellnessMoments = [
  {
    label: "01",
    title: "Thermal arrival",
    description:
      "A warm first impression with spa check-in, quiet lighting, and reassuring pre-arrival structure.",
  },
  {
    label: "02",
    title: "Forest balance",
    description:
      "Natural greens and soft stone tones give the project a strong Jermuk atmosphere without using generic travel visuals.",
  },
  {
    label: "03",
    title: "Luxury without noise",
    description:
      "Rounded cards, airy spacing, and confident typography keep the site premium but not flashy.",
  },
  {
    label: "04",
    title: "Trust by design",
    description:
      "The visual style now supports secure registration and data collection instead of feeling like a temporary mockup.",
  },
] as const;

export const signatureStays = [
  {
    duration: "2 nights / 3 days",
    title: "Soft Landing in Jermuk",
    vibe: "Recovery-first",
    summary:
      "A first-time guest format centered on arrival comfort, spa access, gentle town discovery, and one carefully paced outing.",
    includes: ["Airport transfer planning", "Spa time blocks", "Evening dining rhythm"],
  },
  {
    duration: "4 nights / 5 days",
    title: "Mountain Breath Retreat",
    vibe: "Wellness + nature",
    summary:
      "A longer itinerary that balances mineral-water therapy, scenic drives, canyon viewpoints, and relaxed local experiences.",
    includes: ["Thermal rituals", "Scenic route planning", "Private guide option"],
  },
  {
    duration: "Custom length",
    title: "Private Group Escape",
    vibe: "Family or team",
    summary:
      "A flexible structure for groups needing coordinated rooms, transfers, meal planning, and one shared booking contact.",
    includes: ["Group intake", "Dedicated concierge flow", "Flexible package notes"],
  },
] as const;

export const bookingSteps = [
  {
    icon: Compass,
    title: "Create the traveler account",
    description:
      "Register with email and password right away, or add Google sign-in after the environment variables are connected.",
  },
  {
    icon: CalendarRange,
    title: "Send the inquiry details",
    description:
      "Capture dates, traveler count, desired style, and package interest directly in the database through the inquiry form.",
  },
  {
    icon: MapPinned,
    title: "Respond with a custom plan",
    description:
      "Use the saved traveler and inquiry data as the base for hotel, transfer, and activity coordination.",
  },
  {
    icon: Leaf,
    title: "Scale the content later",
    description:
      "Destinations and tour packages already exist in the Prisma schema, so the next phase can move content into the database cleanly.",
  },
] as const;
