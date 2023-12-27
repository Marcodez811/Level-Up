import getCurrentUser from "@/app/actions/getCurrentUser";
import { db } from "@/db";
import { tasksTable, usersTable } from "@/db/schema";
import levelExperience from "@/lib/utils/levelExperience";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface IParams {
    taskId?: string;
}

const updateTaskSchema = z.object({
  elapsedTime: z.string(),
  completed: z.boolean(),
  lastElapsedTime: z.string().optional(),
})

type UpdateTaskRequest = z.infer<typeof updateTaskSchema>;

export async function DELETE(request: NextRequest, { params }: { params: IParams }) {
    try {
      const { taskId } = params;
      const task = await db.query.tasksTable.findFirst({where: eq(tasksTable.id, Number(taskId))});
      if (!task) return new NextResponse(JSON.stringify("Invalid ID"), { status: 400 });
      await db.delete(tasksTable).where(eq(tasksTable.id, Number(taskId))).execute();
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
    const { elapsedTime, completed, lastElapsedTime } = data as UpdateTaskRequest;
    const currentUser = await getCurrentUser();
    if (!currentUser) return new NextResponse(JSON.stringify("Unauthorized"), { status: 401 });
    const [updatedTask] = await db.update(tasksTable)
                                  .set({ elapsedTime, completed })
                                  .where(eq(tasksTable.id, Number(taskId)))
                                  .returning();
    if (!updatedTask) return new NextResponse(JSON.stringify("Invalid ID"), { status: 400 });
    if (!lastElapsedTime) return NextResponse.json({ updatedTask }, { status: 201 });
    const [taskOwner] = await db.select().from(usersTable).where(eq(usersTable.id, currentUser.id));
    const convertToSec = (time: string) => {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    }
    const elapsedSec = convertToSec(elapsedTime) - convertToSec(lastElapsedTime);
    const totalElapsedTime = convertToSec(taskOwner.totalElapsedTime) + Math.floor(elapsedSec);
    const convertToInterval = (seconds: number) => {
        const hour = Math.floor(seconds / 3600);
        seconds -= hour * 3600;
        const minute = Math.floor(seconds / 60);
        seconds -= minute * 60;
        const second = seconds;
        return `${hour}:${minute}:${second}`;
    }
    await db.transaction(async (tx) => {
      let [user] = await tx
        .update(usersTable)
        .set({ 
          experience: taskOwner.experience + Math.floor(elapsedSec),
          totalElapsedTime: convertToInterval(totalElapsedTime),
        })
        .where(eq(usersTable.id,taskOwner.id))
        .returning(
          { 
            experience: usersTable.experience, 
            level: usersTable.level 
          });

      while (user.experience >= levelExperience[user.level + 1]){
        [user] = await tx.update(usersTable)
                         .set(
                            { 
                              experience: user.experience - levelExperience[user.level + 1], 
                              level: user.level + 1 
                            })
                         .where(eq(usersTable.id, taskOwner.id))
                         .returning();
      };
    });
    return NextResponse.json({ experience: elapsedSec }, { status: 201 });
  } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Something went wrong" },
    { status: 500 });
  }
}