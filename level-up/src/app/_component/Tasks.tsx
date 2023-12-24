import { redirect } from "next/navigation";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import AddTaskClient from "./TaskClientButton";

import { publicEnv } from "@/lib/env/public";


import {createUser, addTask, deleteTask, completeTask} from "./actions";


dayjs.extend(customParseFormat);
// const session = await auth();
// if (!session?.user?.id) return null;
// const userName = session.user.username;
  const username = "test";
export async function AddUserButton() {
  // Create a test user without password
  return (
        <form
          action={async (e) => {
            "use server";
            const result = await createUser("test");
          }}
          className="flex flex-row gap-4"
        >
          <button type="submit">Add User</button>
        </form>
  );
}

export async function AddTask() {
    return (
          <AddTaskClient />
    );
  }

export async function DeleteTaskButton({ taskId }: { taskId: string }) {
    return (
          <form
            action={async (e) => {
              "use server";
              // Delete Task with its displayId
              const result = await deleteTask(taskId);
            }}
            className="flex flex-row gap-4  hover:bg-slate-900 	"
          >
            <button type="submit">Delete Task</button>
          </form>
    );
  }

  export async function CompleteTaskButton({ taskId }: { taskId: string }) {
    return (
          <form
            action={async (e) => {
              "use server";
              // Complete Task with its displayId and owner name
              const result = await completeTask(taskId, username);
            }}
            className="flex flex-row gap-4  hover:bg-slate-900 	"
          >
            <button type="submit">Complete Task</button>
          </form>
    );
  }
