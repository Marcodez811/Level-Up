"use client";

import { useState } from 'react';
import axios from 'axios';
import { TextInput } from '@mantine/core';
import classes from './FloatingLabelInput.module.css';
import { useEventListener } from '@mantine/hooks';
import { addTask } from '../actions/taskActions';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export function FloatingLabelInput() {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const floating = value.trim().length !== 0 || focused || undefined;
  const session = useSession();
  const ref = useEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
          if (!session.data) return;
          if (!session.data.user) return;
          if (!value) return;
          const currentUser = session.data.user;
          await axios.post("/api/tasks", {userId: currentUser.id, content: value})
                    .then(() => setValue(""))
                    .catch(() => toast.error("Something went wrong"));
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