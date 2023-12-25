"use client";
import motivationalQuotes from "@/lib/utils/motivationQuotes";
import { Space, Title, Container } from "@mantine/core";
import { useEffect, useState } from "react";
import TaskSection from "../components/TaskSection";
import { Task } from "@/lib/types/db";

const Home = () => {
    const [quote, setQuote] = useState<string>("");
    const [tasks, setTasks] = useState<Task[]>([]);

    // load a random quote when first load.
    useEffect(() => {
        const getRandomQuote = (): string => {
          const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
          return motivationalQuotes[randomIndex];
        };
        // send get request to backend
        setQuote('\"' + getRandomQuote() + '\"');
    }, []);

    return (
      <>
        <Container fluid>
          <Title order={3}>{quote}</Title>
          <Space h="xl"/>
          <TaskSection tasks={tasks}/>
        </Container>
      </>
    )
}

export default Home;