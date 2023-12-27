import { db } from "@/db";
import { tasksTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import getCurrentUser from "@/app/actions/getCurrentUser";
import levelExperience from '@/lib/utils/levelExperience';
import levelTitles from "@/lib/utils/levelTitles";

interface IParams {
    taskId?: string;
    // action?: string
}

const updateTaskSchema = z.object({
  elapsedTime: z.string(),
  action: z.string(),
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
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); 
    const { taskId } = params;
    const { elapsedTime, action } = data as UpdateTaskRequest;
    // Update the elapsedTime
    const [updatedTask] = await db.update(tasksTable).set({ elapsedTime }).where(eq(tasksTable.id, Number(taskId))).returning();
    if (!updatedTask) return new NextResponse(JSON.stringify("Invalid ID"), { status: 400 });
    // Check the request is for stopping timer or complete a task.
    if (action==="elapsedTime"){
      return NextResponse.json({ updatedTask: 123 }, { status: 201 });
    }
    else if(action==="complete"){
      const [taskOwner] = await db.select().from(usersTable).where(eq(usersTable.id, currentUser.id));
      const convertToSec = (time:string) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
      }
      const elapsedSec = convertToSec(elapsedTime);
      await db.transaction(async (tx) => {
        // Complete the task.
        const [taskElapsedTime] = await tx
          .update(tasksTable)
          .set({ completed: true })
          .where(eq(tasksTable.id, Number(taskId)))
          .returning({elapsedTime: tasksTable.elapsedTime});
        // Add experience to user according to the eplsedTime of the task.
        let [updateUser] = await tx
          .update(usersTable)
          .set({ experience: taskOwner.experience!+Math.floor(convertToSec(taskElapsedTime.elapsedTime)) })
          .where(eq(usersTable.id,taskOwner.id))
          .returning({experience: usersTable.experience, level: usersTable.level});
        // User upgrade.
        while (updateUser.experience>=levelExperience[updateUser.level + 1]){
          console.log(updateUser.experience);
          [updateUser] = await tx.update(usersTable).set({ experience: updateUser.experience-levelExperience[updateUser.level + 1], level: updateUser.level+1 }).where(eq(usersTable.id, taskOwner.id)).returning();
        };
        // Update the title
        await tx.update(usersTable).set({title: levelTitles[updateUser.level]});
      })
      return NextResponse.json(
        { status: 200 },
        )
    }
    else{
      return NextResponse.json(
        { status: 200 },
        )
    }
    // const { elapsedTime } = data as UpdateTaskRequest;
    // const [updatedTask] = await db.update(tasksTable).set({ elapsedTime }).where(eq(tasksTable.id, Number(taskId))).returning();
    // if (!updatedTask) return new NextResponse(JSON.stringify("Invalid ID"), { status: 400 });
    // return NextResponse.json({ updatedTask: 123 }, { status: 201 });
  } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Something went wrong" },
    { status: 500 });
  }
}