import { db } from "@/db";
import { posts } from "@/db/schema";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json(
      { isError: true, error: "Wrong HTTP method" },
      { status: 404 }
    );
  }

  const {
    body,
    roomId,
    authorName,
    stage,
    votes,
  }: {
    body: string;
    roomId: string;
    authorName: string;
    stage: number;
    votes: number;
  } = await request.json();

  const postStage = stage ? stage : 1;
  const postVotes = votes ? votes : 0;

  if (!roomId) {
    return NextResponse.json(
      { isError: true, error: "Post body is required" },
      { status: 404 }
    );
  }

  if (!body) {
    return NextResponse.json(
      { isError: true, error: "Post body is required" },
      { status: 404 }
    );
  }

  if (!authorName) {
    return NextResponse.json(
      { isError: true, error: "Post author is required" },
      { status: 404 }
    );
  }

  try {
    const res = await db
      .insert(posts)
      .values({ body, authorName, roomId, stage: postStage, votes: postVotes })
      .onConflictDoNothing()
      .returning({
        id: posts.id,
        body: posts.body,
        authorName: posts.authorName,
      });

    const data = Array.isArray(res) && res?.length > 0 ? res[0] : res;

    if (process.env.NODE_ENV === "development") {
      console.log("Post created : >> ", data);
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
