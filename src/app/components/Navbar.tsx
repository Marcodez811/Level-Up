"use client";

import { useState } from 'react';
import { Tooltip, UnstyledButton, Stack, useMantineColorScheme, useComputedColorScheme, ActionIcon } from '@mantine/core';
import {
  IconHome2,
  IconLogout,
  IconMoonFilled,
  IconSunFilled,
  IconUser
} from '@tabler/icons-react';
import { Avatar } from '@mantine/core';
import classes from './NavbarMinimal.module.css';
import type { User } from '@/lib/types/db';
import { useRouter } from 'next/navigation'; 
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import cx from "clsx";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 200 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon style={{ width: 20, height: 20 }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const data = [
  { icon: IconHome2, label: 'Home' },
  { icon: IconUser, label: 'Account' },
];

interface NavbarProps {
    user: User;
}

export function Navbar ({user}: NavbarProps) {
  const pathname = usePathname();
  const [active, setActive] = useState(data.findIndex(element => element.label.toLowerCase() === pathname.slice(1)));
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const router = useRouter();
  const links = data.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        setActive(index)
        router.push(`/${link.label.toLowerCase()}`);
      }}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={5}>
          {links}
        </Stack>
      </div>
      <Stack justify="center" gap={15} align='center'>
        <Tooltip label="Switch Mode" position="right" transitionProps={{ duration: 200 }}>
          <ActionIcon
            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
            variant="default"
            size="xl"
            aria-label="Toggle color scheme"
          >
              <IconSunFilled className={cx(classes.icon, classes.light)} stroke={1.5} />
              <IconMoonFilled className={cx(classes.icon, classes.dark)} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="View Data" position="right" transitionProps={{ duration: 200 }}>
            <Avatar
                alt="avatar"
                radius="xl"
                size="md"
                style={{cursor: 'pointer'}}
                src={user.image}
                color="indigo"
                onClick={() => router.push(`/user/${user.id}`)}
            />
        </Tooltip>
        <NavbarLink 
          icon={IconLogout} 
          label="Logout" 
          onClick={async () => await signOut()}
        />
      </Stack>
    </nav>
  );
}