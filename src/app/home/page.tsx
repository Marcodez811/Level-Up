"use client";
import motivationalQuotes from "@/lib/utils/motivationQuotes";
import { Container,  Space } from "@mantine/core";
import { useEffect, useState } from "react";
import TaskSection from "../components/TaskSection";
import { Task } from "@/lib/types/db";

const Home = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
      const getTasks = async () => {
        const res = await fetch(`/api/tasks/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) return;
        
        const data = await res.json();
        
        const tasks = Object.values(data.tasks) as Task[];
        setTasks(tasks);
      };
      getTasks();
      
    }, []);

    return (
      <>
        <Container fluid>
          <Space h="md"/>
          <div style={{borderBottom: "rem(1px) solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))"}}/>
          <TaskSection tasks={tasks}/>
        </Container>
      </>
    )
}

export default Home;