import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") ?? "";

  const res = await db.query.posts.findMany({
    where: (posts, { eq }) => eq(posts.roomId, id),
  });

  const data = id ? res : [];

  return NextResponse.json({ isError: false, data });
}
