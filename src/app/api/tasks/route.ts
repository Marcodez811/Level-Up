import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { tasksTable } from "@/db/schema";
import getCurrentUser from "@/app/actions/getCurrentUser";

const postTaskSchema = z.object({
    userId: z.string(),
    content: z.string(),
});

type PostTaskRequest = z.infer<typeof postTaskSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    // parse will throw an error if the data doesn't match the schema
    postTaskSchema.parse(data);
  } catch (error) {
    // in case of an error, we return a 400 response
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); 
    const { userId, content } = data as PostTaskRequest;
    await db.insert(tasksTable).values({ userId, content }).execute();
    return new NextResponse(JSON.stringify("OK"), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// write get request here