import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { tasksTable } from "@/db/schema";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { desc, eq } from "drizzle-orm";

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
    const [newTask] = await db.insert(tasksTable).values({ userId, content }).returning();
    return NextResponse.json({task: newTask}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// write get request here
export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const tasks = await db.select()
                          .from(tasksTable)
                          .where(eq(tasksTable.userId, currentUser.id))
                          .orderBy((desc(tasksTable.elapsedTime), tasksTable.completed));
    return NextResponse.json({ tasks }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Something wrong" },
      { status: 500 },
    );
  }
}