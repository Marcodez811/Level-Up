import { db } from "@/db";
import { tasksTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface IParams {
    taskId?: string;
}

const updateTaskSchema = z.object({
  elapsedTime: z.string(),
})

type UpdateTaskRequest = z.infer<typeof updateTaskSchema>;

export async function DELETE(request: NextRequest, { params }: { params: IParams }) {
    try {
      const { taskId } = params;
      const task = await db.query.tasksTable.findFirst({where: eq(tasksTable.id, Number(taskId))});
      if (!task) return new NextResponse(JSON.stringify("Invalid ID"), { status: 400 });
      const [deletedTask] = await db.delete(tasksTable).where(eq(tasksTable.id, Number(taskId))).returning();
      return new NextResponse(JSON.stringify("OK"), { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Something went wrong" },
      { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: IParams }) {
  const data = await request.json();
  try {
    updateTaskSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const { taskId } = params;
    const { elapsedTime } = data as UpdateTaskRequest;
    const [updatedTask] = await db.update(tasksTable).set({ elapsedTime }).where(eq(tasksTable.id, Number(taskId))).returning();
    if (!updatedTask) return new NextResponse(JSON.stringify("Invalid ID"), { status: 400 });
    return NextResponse.json({ updatedTask: 123 }, { status: 201 });
  } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Something went wrong" },
    { status: 500 });
  }
}