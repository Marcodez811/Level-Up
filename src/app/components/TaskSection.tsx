"use client";

import { ScrollArea, Stack, Title } from "@mantine/core";
import classes from "./TaskSection.module.css";
import cx from 'clsx';
import { FloatingLabelInput } from "./FloatingLabelInput";
import { Task } from "@/lib/types/db";
import { Mission } from "./Mission";
import { Dispatch, SetStateAction } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const TaskSection = ({tasks, setTasks}: {tasks: Task[], setTasks: Dispatch<SetStateAction<Task[]>>}) => {
  const items = tasks.map((t, idx) => (
    <Draggable key={t.id} index={idx} draggableId={t.id.toString()}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Mission 
            key={t.id}
            task={t}
            setTasks={setTasks}/>
        </div>
      )}
    </Draggable>
  ));

  return (
    <Stack 
      w={800} 
      h={700}
      className={classes.sectionBorder}
      >
        <Title order={4}>{"Mission Panel"}</Title>
        <FloatingLabelInput setTasks={setTasks}/>
        <ScrollArea h={500}>
            <Stack p={15} align="center" justify="center" w="100%">
              <DragDropContext
                onDragEnd={({ destination, source }) => {
                  if (!destination) return;
                  const updatedTasks = Array.from(tasks);
                  const [movedTask] = updatedTasks.splice(source.index, 1);
                  updatedTasks.splice(destination.index, 0, movedTask);
                  setTasks(updatedTasks);
                }}
              >
                <Droppable droppableId="dnd-list" direction="vertical">
                  {(provided) => (
                    <div 
                      {...provided.droppableProps} 
                      ref={provided.innerRef}
                      style={{width: "100%"}}>
                      {items}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Stack>
        </ScrollArea>
    </Stack>
  )
}

export default TaskSection;