"use client";

import { Dispatch, SetStateAction, useState } from 'react';
import { TextInput } from '@mantine/core';
import classes from './FloatingLabelInput.module.css';
import { useEventListener } from '@mantine/hooks';
import { useSession } from 'next-auth/react';
import { notifications } from '@mantine/notifications';
import { Task } from '@/lib/types/db';

export function FloatingLabelInput({setTasks}: {setTasks: Dispatch<SetStateAction<Task[]>>}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const floating = value.trim().length !== 0 || focused || undefined;
  const session = useSession();
  const ref = useEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        try {
          if (!session.data) return;
          if (!session.data.user) return;
          if (!value) return;
          const currentUser = session.data.user;
          // switched to using fetch because axios kept giving me weird errors :p
          const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: currentUser.id, content: value }),
          });
        
          if (!response.ok) {
            throw new Error("Something went wrong");
          }
          const data = await response.json();
          const newTask = data.task;
          setTasks(tasks => [newTask, ...tasks]);
          setValue("");
        } catch (error: any) {
          notifications.show({
              title: "Error",
              message: "Something went wrong while setting up this todo!",
              color: "red"
          });
        }
      } 
  });

  return (
    <TextInput
      label="Add new mission for the day"
      placeholder="Press Enter to Save Mission!"
      required
      ref={ref}
      classNames={classes}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      mt="md"
      autoComplete="nope"
      data-floating={floating}
      labelProps={{ 'data-floating': floating }}
    />
  );
}