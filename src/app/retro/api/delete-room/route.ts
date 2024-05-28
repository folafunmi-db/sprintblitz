import { db } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  if (request.method !== "DELETE") {
    return NextResponse.json(
      { isError: true, error: "Wrong HTTP method" },
      { status: 404 }
    );
  }

  const { id }: { id: string } = await request.json();

  if (!id) {
    return NextResponse.json(
      { isError: true, error: "Room id is required" },
      { status: 404 }
    );
  }

  try {
    const res = await db.delete(rooms).where(eq(rooms.id, id)).returning();

    const data = res;

    if (process.env.NODE_ENV === "development") {
      console.log("Room deleted: >> ", data);
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
