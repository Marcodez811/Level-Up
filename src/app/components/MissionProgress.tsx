import { Text, Card, RingProgress, Group } from '@mantine/core';
import classes from './MissionProgress.module.css';
import type { UserInfo } from '@/lib/types/db';
import levelExperience from '@/lib/utils/levelExperience';


export function MissionProgress({user}: {user: UserInfo}) {

  const stats = [
    { value: levelExperience[user.level + 1] - user.experience, label: 'Remaining' },
    { value: user.experience, label: 'In progress' },
  ];  

  const completed = user.experience;
  const total = levelExperience[user.level + 1];
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text className={classes.label}>{stat.value}</Text>
      <Text size="xs" c="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card withBorder p="xl" radius="md" className={classes.card}>
      <div className={classes.inner}>
        <div>
          <Text fz="xl" className={classes.label}>
            Focused Time
          </Text>
          <div>
            <Text className={classes.lead} mt={30}>
              {user.totalElapsedTime}
            </Text>
            <Text fz="xs" c="dimmed">
              total time
            </Text>
          </div>
          <Group mt="lg">{items}</Group>
        </div>

        <div className={classes.ring}>
          <RingProgress
            roundCaps
            thickness={6}
            size={150}
            sections={[{ value: (completed / total) * 100, color: "violet" }]}
            label={
              <div>
                <Text ta="center" fz="lg" className={classes.label}>
                  {((completed / total) * 100).toFixed(0)}%
                </Text>
                <Text ta="center" fz="xs" c="dimmed">
                  To next level
                </Text>
              </div>
            }
          />
        </div>
      </div>
    </Card>
  );
}