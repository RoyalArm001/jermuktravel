import { NextResponse } from "next/server";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { getSafeAuthSession } from "@/lib/auth";
import { inquirySchema } from "@/lib/validators";

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      {
        error:
          "Inquiry saving is not available yet. Connect the database first, then try again.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as unknown;
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message ?? "Invalid inquiry payload.",
        },
        { status: 400 },
      );
    }

    const session = await getSafeAuthSession();

    await prisma.inquiry.create({
      data: {
        userId: session?.user?.id || undefined,
        fullName: parsed.data.fullName,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone,
        travelWindow: parsed.data.travelWindow,
        guests: parsed.data.guests,
        tripStyle: parsed.data.tripStyle,
        destinationLabel: parsed.data.destinationLabel,
        packageLabel: parsed.data.packageLabel,
        message: parsed.data.message,
      },
    });

    return NextResponse.json(
      {
        message: "Inquiry saved successfully. You can now follow up from the database side.",
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Inquiry saving is not available yet. Connect the database first, then try again.",
      },
      { status: 503 },
    );
  }
}
