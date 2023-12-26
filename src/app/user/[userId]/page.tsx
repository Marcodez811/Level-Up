"use client";
import motivationalQuotes from "@/lib/utils/motivationQuotes";
import { Container,  Space } from "@mantine/core";
import { useEffect, useState } from "react";
import TaskSection from "../../components/TaskSection";
import { Task } from "@/lib/types/db";

const Home = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
    }, []);

    return (
      <>
        <Container fluid>
          <Space h="md"/>
          <div style={{borderBottom: "rem(1px) solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))"}}/>
        </Container>
      </>
    )
}

export default Home;