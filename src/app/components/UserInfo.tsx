import { Avatar, Text, Group, Stack, Title, Space } from '@mantine/core';
import { IconAt, IconArrowBigUpLinesFilled } from '@tabler/icons-react';
import classes from './UserInfoIcons.module.css';
import { UserInfo } from '@/lib/types/db';
import { MissionProgress } from './MissionProgress';

interface UserInfoProps {
    user: UserInfo;
}

export function UserInfo({user} : UserInfoProps) {
  return (
    <div>
      <Stack 
        w={800} 
        h={700}
        className={classes.sectionBorder}
        >
        <Title order={4}>{"User Panel"}</Title>
            <Group wrap="nowrap">
              <Avatar
                src={user.image}
                size={150}
                radius="md"
              />
              <div>
                <Text size="xl" tt="uppercase" fw={700}>
                  {user.title}
                </Text>
                <Text size="lg" fw={500} className={classes.name}>
                  {user.username}
                </Text>
                <Group wrap="nowrap" gap={10} mt={3}>
                    <IconAt stroke={1.5} size="1.25rem" className={classes.icon} />
                    <Text size="md" c="dimmed">
                      {user.email}
                    </Text>
                  </Group>
                  <Group wrap="nowrap" gap={10} mt={5}>
                    <IconArrowBigUpLinesFilled stroke={1.5} size="1.25rem" className={classes.icon} />
                    <Text size="md" c="dimmed">
                      Level: {user.level}
                    </Text>
                  </Group>
                </div>
            </Group>
            <Space h={50}/>
            <MissionProgress user={user}/>
        </Stack>
    </div>
  );
}