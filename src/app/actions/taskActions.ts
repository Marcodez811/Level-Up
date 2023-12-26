"use server";

import { db } from "@/db";
import {
    tasksTable,
} from "@/db/schema";
import getCurrentUser from "./getCurrentUser";

export const addTask = async (taskInfo : string) => {
    try{
        const currentUser = await getCurrentUser();
        if (!currentUser) return null;
        const createdTask = await db.insert(tasksTable).values({userId: currentUser.id, content: taskInfo}).returning();
        return createdTask;
    } catch (e) {
        console.error(e);
        throw new Error("Some other error!");  
    }
}