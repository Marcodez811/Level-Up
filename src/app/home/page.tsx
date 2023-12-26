"use client";
import { Container,  Space } from "@mantine/core";
import { useEffect, useState } from "react";
import TaskSection from "../components/TaskSection";
import { Task } from "@/lib/types/db";
import axios from "axios";

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axios.get("/api/tasks");
              const data = response.data;
              setTasks(data.tasks);
          } catch (error) {
              console.error("Error fetching tasks:", error);
          }
      };
      fetchData();
  }, []);

  return (
      <>
          <Container fluid>
              <Space h="md" />
              <TaskSection tasks={tasks} setTasks={setTasks}/>
          </Container>
      </>
  );
}

export default Home;
