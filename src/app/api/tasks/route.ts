import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { sql, eq, and } from "drizzle-orm";
import { db } from "@/db";
import { tasksTable, usersTable } from "@/db/schema";
import getCurrentUser from "@/app/actions/getCurrentUser";
import levelExperience from '@/lib/utils/levelExperience';
import { Task } from "@/lib/types/db";
const postTaskSchema = z.object({
    userId: z.string(),
    content: z.string(),
});
const updateTaskSchema = z.object({
  taskId: z.number(),
})

type PostTaskRequest = z.infer<typeof postTaskSchema>;
type UpdateTaskRequest = z.infer<typeof updateTaskSchema>;

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
// write delete request here
// write get request here
// GET request
export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, currentUser.id));
    const lastUpdate = new Date(user.lastUpdate);
    const current = new Date();
    const diff = current.getTime() - lastUpdate.getTime();
    const tasks = await db.update(tasksTable)
        .set({ duration: sql`${tasksTable.duration}+${diff}` })
        .where(eq(tasksTable.pause, false))
        .returning();
    const orederedTasks = tasks.sort((a, b) => {
      const completedComparison = (a.completed!?1:0) - (b.completed?1:0);
      if (completedComparison !== 0) {
        return completedComparison;
      }
      const aTime = new Date(a.createdAt!);
      const bTime = new Date(b.createdAt!)
      const timeDiff =  bTime.getTime() - aTime.getTime();
      return timeDiff;
    })
    await db.update(usersTable).set({lastUpdate: current.toISOString()}).where(eq(usersTable.id, user.id));
    return NextResponse.json({
      tasks: orederedTasks,
    },
    { status: 200 },
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Something wrong" },
      { status: 500 },
    );
  }
}

// DELETE request
export async function DELETE(req: NextRequest) {
  const data = await req.json();
  try {
    updateTaskSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const { taskId } = data as UpdateTaskRequest;
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); 
    // Check task ownership
    const [task] = await db.select().from(tasksTable).where(eq(tasksTable.userId, currentUser.id));
    if (!task) {
      return NextResponse.json({ error: "Task Not Found" }, { status: 404 });
    }
    await db.delete(tasksTable).where(eq(tasksTable.id, taskId));
    return NextResponse.json(
      { status: 200 },
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Something wrong" },
      { status: 500 },
    );
  }
}

// PUT request
export async function PUT(req:NextRequest) {
  const data = await req.json();
  try {
    updateTaskSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const { taskId } = data as UpdateTaskRequest;
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); 
    // Check task ownership
    const [task] = await db.select().from(tasksTable).where(and(eq(tasksTable.userId, currentUser.id), eq(tasksTable.id, taskId)));
    if (!task) {
      return NextResponse.json({ error: "Task Not Found" }, { status: 404 });
    }
    const [taskOwner] = await db.select().from(usersTable).where(eq(usersTable.id, currentUser.id));
    await db.transaction(async (tx) => {
      const [taskDuration] = await tx
        .update(tasksTable)
        .set({ completed: true })
        .where(eq(tasksTable.id, taskId))
        .returning({duration: tasksTable.duration});
      const [updateUser] = await tx
        .update(usersTable)
        .set({ experience: taskOwner.experience!+Math.floor(taskDuration.duration!*(5.787037*0.0000001)) })
        .where(eq(usersTable.id,taskOwner.id))
        .returning({experience: usersTable.experience, level: usersTable.level});
      while (updateUser.experience!>=levelExperience[updateUser.level + 1]){
        await tx.update(usersTable).set({ experience: updateUser.experience!-levelExperience[updateUser.level + 1], level: updateUser.level!+1 }).where(eq(usersTable.id, taskOwner.id));
      }
    });
    return NextResponse.json(
        { status: 200 },
        )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Something wrong" },
      { status: 500 },
    );
  }
}