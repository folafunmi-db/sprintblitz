import { db } from "@/db";
import { posts } from "@/db/schema";
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
      { isError: true, error: "Post id is required" },
      { status: 404 }
    );
  }

  try {
    const res = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning({ id: posts.id, body: posts.body });

    const data = res;

    if (process.env.NODE_ENV === "development") {
      console.log("Post deleted: >> ", data);
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
