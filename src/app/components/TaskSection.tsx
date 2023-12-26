"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Stack, Title } from "@mantine/core";
import classes from "./TaskSection.module.css"
import { FloatingLabelInput } from "./FloatingLabelInput";
import { Task } from "@/lib/types/db";

const TaskSection = ({tasks}: {tasks: Task[]}) => {
  const router = useRouter();
  const [showedTasks, setShowedTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  useEffect(() => {
    setShowedTasks(tasks);
  }, [tasks]);
  const completeTask = async (taskId: number) => {
    window.location.reload();
    const res = await fetch(`/api/tasks/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId: taskId,
      }),
    });
    if (!res.ok) {
      return;
    }
    const updateTasks = () => setCompletedTasks(prevState => [...prevState, taskId]);
    updateTasks();
    router.refresh();
  };
  const deleteTask =async (taskId:number) => {
    const res = await fetch(`/api/tasks/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId: taskId,
      }),
    });
    if (!res.ok) {
      return;
    }
    const updateTasks = () => setShowedTasks(showedTasks.filter((task) => task.id!==taskId));
    updateTasks();
    router.refresh();
  }
  return (
    <Stack 
      w={700} 
      h={700} 
      className={classes.sectionBorder}
      >
        <Title order={4}>{"Mission Panel"}</Title>
        <FloatingLabelInput />
        {/* {tasks.map(task => task.content)} */}
        {showedTasks.map(task => (
          <div key={task.id}>
            <span>ID: {task.id} {"     "} Content: {task.content}</span>
            <button onClick={() => {completeTask(task.id)} } disabled={completedTasks.includes(task.id) || task.completed!}>Complete</button>
            <button onClick={() => {deleteTask(task.id)}}>Delete</button>
          </div>
        ))}
    </Stack>
  )
}

export default TaskSection