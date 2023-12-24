"use server";

import {
  eq,
} from "drizzle-orm";
// import { toast } from "react-toastify";

import { db } from "@/DB";
import {
  usersTable,
  tasksTable,
  messagesTabel,
} from "@/DB/schema";
import { privateEnv } from "@/lib/env/private";
import { publicEnv } from "@/lib/env/public";

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);


export const createUser = async (userName: string) => {
  console.log("[createUser]");

  const newUser = await db.insert(usersTable).values({
    username: userName,
    email: "test@gmail.com",
  });
  return newUser;
};


export const getTasks = async (username:string) => {
  console.log("[getTasks]");
  return db.select().from(tasksTable).where(eq(tasksTable.owner, username))
}

export const addTask = async (name:string, content:string, owner:string, time:string, difficulty:number) => {
  console.log("[createTask]");
  if (! dayjs(time, 'YYYY-MM-DD', true).isValid()) {
    throw new Error("Date invalid!");
    // alert("Date invalid!");
    // return;
  };
  try{
    console.log("success");
    const newTaskId = await db.insert(tasksTable).values({
      name: name,
      content: content,
      owner: owner,
      time: time,
      difficulty: difficulty,
    });
  } catch (e) {
    throw new Error("Some other error!");  
  }
  // return "success";
  // return newTaskId;
}

export const deleteTask = async (id:string) => {
  "use server";
  console.log("[deleteTask]");
  await db.delete(tasksTable).where(eq(tasksTable.displayId, id));
}

export const completeTask = async (id:string, owner:string) => {
  console.log("[completeTask]");
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