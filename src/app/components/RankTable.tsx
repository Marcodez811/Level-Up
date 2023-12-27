"use client";

import { Table, Progress, Anchor, Text, Group, ScrollArea, Avatar } from '@mantine/core';
import classes from "./RankTable.module.css";
import { User } from '@/lib/types/db';
import { useState } from 'react';
import cx from "clsx";
import levelExperience from '@/lib/utils/levelExperience';

import { CldUploadButton, CldUploadButtonProps , CldUploadWidget, CldImage, getCldImageUrl } from 'next-cloudinary';

interface RankTableProps {
    users: User[];
}

export function RankTable({users} : RankTableProps) {
  const [scrolled, setScrolled] = useState(false);
  
  const rows = users.map((user, idx) => {
    const total = levelExperience[user.level + 1];
    const pos = (user.experience / total) * 100;
    const neg = 100 - pos;
    const url = getCldImageUrl({
      width: 960,
      height: 600,
      src: user.image?user.image:''
    });
    return (
      <Table.Tr key={user.id}>
        <Table.Td><Text size="sm" fw={700}>{idx + 1}</Text></Table.Td>
        <Table.Td>
          <Group gap="xs">
            {/* <Avatar
              alt="avatar"
              size="md"
              src={user.image}
              color="violet"
            /> */}
            <Avatar
              alt="avatar"
              size="md"
              // src={user.image}
              src={url}
              color="indigo"
            />
            {/* todo: push the route to user/[userid] */}
            {/* todo: check if there's a way to change the theme so that anchor can display different color in different themes */}
            <Anchor 
              component="button" 
              fz="sm" 
              c="gray"
              fw={700}
            >
              {user.username}
            </Anchor>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text size="sm" fw={700}>{user.level}</Text>
        </Table.Td>
        <Table.Td>
          <Group justify="space-between">
            <Text fz="xs" c="teal" fw={700}>
              {pos.toFixed(0)}%
            </Text>
          </Group>
          <Progress.Root>
            <Progress.Section
              value={pos}
              color="teal"
            />
            <Progress.Section
              value={neg}
              color="gray"
            />
          </Progress.Root>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
    <ScrollArea 
      h={500}
      p={20}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table miw={450} align="center">
        <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <Table.Tr>
              <Table.Th><Text size="sm" fw={700}>#</Text></Table.Th>
              <Table.Th><Text size="sm" fw={700}>User</Text></Table.Th>
              <Table.Th><Text size="sm" fw={700}>Level</Text></Table.Th>
              <Table.Th><Text size="sm" fw={700}>To next level</Text></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
    </>
  );
}