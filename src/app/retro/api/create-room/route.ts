import { db } from "@/db";
import { rooms } from "@/db/schema";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json({ error: "Wrong HTTP method" }, { status: 404 });
  }

  const { name }: { name: string } = await request.json();

  if (!name) {
    return NextResponse.json(
      { error: "Room name is required" },
      { status: 404 }
    );
  }

  try {
    const res = await db
      .insert(rooms)
      .values({ name })
      .onConflictDoNothing()
      .returning();

    const data = res;

    if (process.env.NODE_ENV === "development") {
      console.log("Room added:>> ", data);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occured" }, { status: 500 });
  }
}
