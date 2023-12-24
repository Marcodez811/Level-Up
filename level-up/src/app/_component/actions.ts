"use server";

import {
  eq,
} from "drizzle-orm";

import { db } from "@/DB";
import {
  usersTable,
  tasksTable,
  messagesTabel,
} from "@/DB/schema";
import { privateEnv } from "@/lib/env/private";
import { publicEnv } from "@/lib/env/public";
import { table } from "console";

export const createUser = async (userName: string) => {
  "use server";
  console.log("[createUser]");

  const newUser = await db.insert(usersTable).values({
    username: userName,
    email: "test@gmail.com",
  });
  return newUser;
};

export const addTask =async (name:string, content:string, owner:string, time:string, difficulty:number) => {
  "use server";
  console.log("[createTask]");

  const newTaskId = await db.insert(tasksTable).values({
    name: name,
    content: content,
    owner: owner,
    time: time,
    difficulty: difficulty,
  });
  return newTaskId;
}

export const deleteTask = async (id:string) => {
  "use server";
  console.log("[deleteTask]");
  await db.delete(tasksTable).where(eq(tasksTable.displayId, id));
}

export const completeTask = async (id:string, owner:string) => {
  "use server";
  console.log("[completeTask]");
  // const [taskOwner] = db.select().from(usersTable).where(eq(usersTable.username, owner));
  const [taskOwner] = await db.select().from(usersTable).where(eq(usersTable.username, owner));
  await db.transaction(async (tx) => {
    const [taskDifficulty] = await tx
      .update(tasksTable)
      .set({ completed: true })
      .where(eq(tasksTable.displayId, id))
      .returning({difficulty: tasksTable.difficulty});
    const [updateUser] = await tx
      .update(usersTable)
      .set({ experience: taskOwner.experience!+taskDifficulty.difficulty!*10 })
      .where(eq(usersTable.username,taskOwner.username))
      .returning({experience: usersTable.experience, level: usersTable.level});
    if (updateUser.experience!>=updateUser.level!*100){
      await tx.update(usersTable).set({ experience: updateUser.experience!-updateUser.level!*100, level: updateUser.level!+1 }).where(eq(usersTable.displayId, taskOwner.displayId));
    }
  });
}