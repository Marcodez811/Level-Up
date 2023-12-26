"use client";

import { Stack, Title } from "@mantine/core";
import classes from "./TaskSection.module.css"
import { FloatingLabelInput } from "./FloatingLabelInput";
import { Task } from "@/lib/types/db";

const TaskSection = ({tasks}: {tasks: Task[]}) => {
  return (
    <Stack 
      w={700} 
      h={700} 
      className={classes.sectionBorder}
      >
        <Title order={4}>{"Mission Panel"}</Title>
        <FloatingLabelInput />
        {tasks.map(task => task.content)}
    </Stack>
  )
}

export default TaskSection