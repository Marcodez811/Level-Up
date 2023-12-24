
import { redirect } from "next/navigation";



import { publicEnv } from "@/lib/env/public";


import {createUser, addTask, deleteTask, completeTask} from "./actions";

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
export async function AddTaskButton() {
    return (
          <form
            action={async (e) => {
              "use server";
              // Create a task by calling 'addTask(task name, content, owner, time, difficulty)' .
              const result = await addTask("Task1", "1st task", "test", "2024-01-01", 1);
            }}
            className="flex flex-row gap-4"
          >
            <button type="submit">Add Task</button>
          </form>
    );
  }

export async function DeleteTaskButton() {
    return (
          <form
            action={async (e) => {
              "use server";
              // Delete Task with its displayId
              const result = await deleteTask("29baff0f-c521-49ec-8321-f581127fa426");
            }}
            className="flex flex-row gap-4"
          >
            <button type="submit">Delete Task</button>
          </form>
    );
  }

  export async function CompleteTaskButton() {
    return (
          <form
            action={async (e) => {
              "use server";
              // Complete Task with its displayId and owner name
              const result = await completeTask("4932d2f2-1f5c-47db-913e-24f6c8f0a6ea", "test");
            }}
            className="flex flex-row gap-4"
          >
            <button type="submit">Complete Task</button>
          </form>
    );
  }
// export default AddUserButton;
