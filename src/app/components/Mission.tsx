import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Checkbox, Text, Paper, Flex, Group, ActionIcon } from '@mantine/core';
import { IconPlayerPlayFilled, IconPlayerPauseFilled, IconTrash } from '@tabler/icons-react';
import axios from 'axios';
import { Task } from '@/lib/types/db';
import classes from './CheckboxCard.module.css';
import { notifications } from '@mantine/notifications';

export function Mission({ task, setTasks }: { task: Task; setTasks: Dispatch<SetStateAction<Task[]>> }) {
  const [value, onChange] = useState(task.completed);
  const [timer, setTimer] = useState(task.elapsedTime);
  const [ticking, setTicking] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>(undefined);
  const onDelete = async () => {
    setTicking(false);
    await axios.delete(`/api/tasks/${task.id}`);
    setTasks((tasks) => tasks.filter((t) => t.id !== task.id));
  };

  const updateTimer = () => {
    setTimer((prevTimer) => {
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
          body: JSON.stringify({ elapsedTime: timer, completed: !value, lastElapsedTime: "" }),
        });
        const responseData = await response.json();
        console.log("Timer value updated successfully:", responseData);
      } catch (error) {
        console.error("Error updating timer value:", error);
      }
    };
  
    if (ticking) {
      // Update the timer every 1000 ms
      const newIntervalId = setInterval(updateTimer, 1000);
      setIntervalId(newIntervalId);
      return () => clearInterval(newIntervalId);
    } else {
      if (value) return; 
      updateTimerValue();
    }
  }, [ticking, task.id, timer, value]);

  const onComplete = async () => {
    let responseData;
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            elapsedTime: timer,
            completed: !value,
            lastElapsedTime: task.elapsedTime 
          }),
      });
  
      if (!response.ok) {
        throw new Error(`Error updating timer value: ${response.status} ${response.statusText}`);
      }
      responseData = await response.json();
      onChange(!value);
    } catch (error) {
      console.error("Error updating timer value:", error);
    }
    if (!value) {
      notifications.show({
          title: "Success",
          message: `You just gained ${responseData.experience} experience by focusing!`,
          color: "green"
      });
    }
  };
  

  return (
    <Paper className={classes.button} w="95%" >
      <Flex justify="space-between" w="100%">
        <Group gap={0}>
          <Checkbox
            checked={value}
            onChange={onComplete}
            tabIndex={-1}
            size="md"
            mr="xl"
            styles={{ input: { cursor: 'pointer' } }}
            aria-hidden
            color="violet"
          />
          <div>
            <Text size="sm" fw={700} td={value? "line-through": ""}>
              {task.content}
            </Text>
          </div>
        </Group>
        <Group>
          <Text>{timer}</Text>
          <ActionIcon
            variant="transparent"
            disabled={value}
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
