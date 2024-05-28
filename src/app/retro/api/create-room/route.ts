import { db } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json(
      { isError: true, error: "Wrong HTTP method" },
      { status: 404 }
    );
  }

  const { name }: { name: string } = await request.json();

  if (!name) {
    return NextResponse.json(
      { isError: true, error: "Room name is required" },
      { status: 404 }
    );
  }

  try {
    const existingRoom = await db
      .select()
      .from(rooms)
      .where(eq(rooms.name, name));

    if (existingRoom) {
      return NextResponse.json(
        { isError: true, error: "Room name already exists" },
        { status: 409 } // 409 Conflict status code
      );
    }

    const res = await db
      .insert(rooms)
      .values({ name })
      .onConflictDoNothing()
      .returning({ id: rooms.id, name: rooms.name });

    const data = Array.isArray(res) && res?.length > 0 ? res[0] : res;

    if (process.env.NODE_ENV === "development") {
      console.log("Room added: >> ", data);
    }

    return NextResponse.json({ isError: false, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { isError: true, error: "An error occured" },
      { status: 500 }
    );
  }
}
