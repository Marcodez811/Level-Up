import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox, Text, Paper, Flex, Group, ActionIcon } from '@mantine/core';
import { IconPlayerPlayFilled, IconPlayerPauseFilled, IconTrash } from '@tabler/icons-react';
import axios from 'axios';
import { Task } from '@/lib/types/db';
import classes from './CheckboxCard.module.css';

export function Mission({ task, setTasks }: { task: Task; setTasks: Dispatch<SetStateAction<Task[]>> }) {
  const [value, onChange] = useState(task.completed);
  const [timer, setTimer] = useState(task.elapsedTime);
  const [ticking, setTicking] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>(undefined);

  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const router = useRouter();

  const onDelete = async () => {
    setTicking(false);
    await axios.delete(`/api/tasks/${task.id}`);
    setTasks((tasks) => tasks.filter((t) => t.id !== task.id));
  };

  const updateTimer = () => {
    setTimer((prevTimer) => {
      // Parse the previous timer value
      const [hours, minutes, seconds] = prevTimer.split(':').map(Number);
      // Increment the seconds
      let newSeconds = seconds + 1;
      // Update minutes and reset seconds when it reaches 60
      let newMinutes = minutes;
      if (newSeconds === 60) {
        newMinutes += 1;
        newSeconds = 0;
      }
      // Update hours and reset minutes when it reaches 60
      let newHours = hours;
      if (newMinutes === 60) {
        newHours += 1;
        newMinutes = 0;
      }
      // Format the new timer value
      const formattedTimer = `${newHours.toString().padStart(2, '0')}:${newMinutes
        .toString()
        .padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;

      return formattedTimer;
    });
  };

  useEffect(() => {
    const updateTimerValue = async () => {
      try {
        const response = await fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            elapsedTime: timer,
            action: "elapsedTime"
          }),
        });
      
        if (!response.ok) {
          throw new Error(`Error updating timer value: ${response.status} ${response.statusText}`);
        }
      
        const responseData = await response.json();
        console.log("Timer value updated successfully:", responseData);
      } catch (error) {
        console.error("Error updating timer value:", error);
      }
      
    };
    // setCompletedTasks(completedTasks);
    if (ticking) {
      // Update the timer every 1000 ms
      const newIntervalId = setInterval(updateTimer, 1000);
      setIntervalId(newIntervalId);
      return () => clearInterval(newIntervalId);
    } else {
      // send put request to backend
      console.log("Stopped timer, sending PUT request...");
      updateTimerValue();
    }
  }, [ticking, task.id, timer]);

  const onComplete = async (taskId:number) => {
    // Your logic for completing the task
    // When completing the task, stop timer and send a PUT request to task/[taskId].
    setTicking(false);
    
    console.log("Sending request...")
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        elapsedTime: timer,
        action: "complete",
      }),
    });
    if (!res.ok) {
      return;
    }
    const updateTasks = () => setCompletedTasks(prevState => [...prevState, taskId]); 
    updateTasks();
   
    router.refresh();
  };

  return (
    <Paper className={classes.button}>
      <Flex justify="space-between" w="100%">
        <Group gap={0}>
          <Checkbox
            disabled={task.completed || completedTasks.includes(task.id) }
            checked={value}
            onChange={() => onChange(!value)}
            onClick={() => onComplete(task.id)}
            tabIndex={-1}
            size="md"
            mr="xl"
            styles={{ input: { cursor: 'pointer' } }}
            aria-hidden
            color="violet"
          />
          <div>
            <Text size="sm" fw={700}>
              {task.content}
            </Text>
          </div>
        </Group>
        <Group>
          <Text>{timer}</Text>
          <ActionIcon
            variant="transparent"
            disabled={task.completed || completedTasks.includes(task.id)}
            color="violet"
            size="sm"
            onClick={() => {
              setTicking(t => !t);
            }}
          >
            {!ticking ? <IconPlayerPlayFilled /> : <IconPlayerPauseFilled />}
          </ActionIcon>
          <ActionIcon variant="transparent" onClick={onDelete} color='red'>
            <IconTrash />
          </ActionIcon>
        </Group>
      </Flex>
    </Paper>
  );
}
