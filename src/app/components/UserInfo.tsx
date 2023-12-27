import { Avatar, Text, Group } from '@mantine/core';
import { IconAt, IconArrowBigUpLinesFilled } from '@tabler/icons-react';
import classes from './UserInfoIcons.module.css';
import { User } from '@/lib/types/db';
import { getCldImageUrl } from 'next-cloudinary';


interface UserInfoProps {
    user: User;
}

export function UserInfo({user} : UserInfoProps) {
  const url = getCldImageUrl({
    width: 960,
    height: 600,
    src: user.image?user.image:''
  });
  return (
    <div>
      <Group wrap="nowrap">
        <Avatar
          // src={user.image}
          src={url}
          size={94}
          radius="md"
        />
        <div>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            {user.level === 1? "Noobie": "TEST"}
          </Text>

          <Text fz="lg" fw={500} className={classes.name}>
            {user.username}
          </Text>
          <Group wrap="nowrap" gap={10} mt={3}>
            <IconAt stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {user.email}
            </Text>
          </Group>
          <Group wrap="nowrap" gap={10} mt={5}>
            <IconArrowBigUpLinesFilled stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              Level: {user.level}
            </Text>
          </Group>
        </div>
      </Group>
    </div>
  );
}