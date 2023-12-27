"use client";

import { useState, useCallback, forwardRef } from 'react';
import { useRouter } from 'next/navigation'; 
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { privateEnv } from "@/lib/env/private";


import { Tooltip, UnstyledButton, Stack, useMantineColorScheme, useComputedColorScheme, ActionIcon } from '@mantine/core';
import {
  IconHome2,
  IconDeviceDesktopAnalytics,
  IconLogout,
  IconMoonFilled,
  IconSunFilled,
} from '@tabler/icons-react';
import { Avatar } from '@mantine/core';
import classes from './NavbarMinimal.module.css';
import { CldUploadButton, CldUploadButtonProps , CldUploadWidget, CldImage, getCldImageUrl } from 'next-cloudinary';

import { User } from '@/lib/types/db';
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
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
];

interface NavbarProps {
    user: User;
}

export function Navbar ({user}: NavbarProps) {
  const pathname = usePathname();
  const [active, setActive] = useState(data.findIndex(element => element.label.toLowerCase() === pathname.slice(1)));
  const [imgPublicId, setImgPublicId] = useState('/');
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
  const [imgUrl, setImgUrl] = useState(getCldImageUrl({
    width: 960,
    height: 600,
    src: user.image?user.image:''
  }));
  // handle user image upload
  const handleUpload = useCallback(
    async(result:any) => {
      const res = await fetch(`/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imgId: result.info.public_id
        }),
      });
      if (!res.ok) {
        return;
      }
      const updateUrl =async () => {
        const url = getCldImageUrl({
          width: 960,
          height: 600,
          src: result.info.public_id
        });
        setImgUrl(url);
      }
      updateUrl();
      
      router.refresh();
    },
    []
  )
  type propType = {
    uploadPreset:string, 
    onUpload:(result: any) => void, 
    user: User
  }
  const uploadProps = {
    uploadPreset: "uploadPreset", // ? should it be a env variable?
    onUpload: handleUpload, 
    user: user
  }
  const UploadButtonWithRef = forwardRef((props:propType, ref) => {
    const {uploadPreset, onUpload, user} = props;
    return(
    <CldUploadButton uploadPreset={uploadPreset} onUpload={onUpload}>
      <Avatar
        alt="avatar"
        radius="xl"
        size="md"
        src={imgUrl}
        color="indigo"
      />
    </CldUploadButton>
  )});
  
  

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={5}>
          {links}
        </Stack>
      </div>
      <Stack justify="center" gap={10} align='center'>
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
        {/* <NavbarLink 
          icon={computedColorScheme === 'light'? 
                                          IconMoonFilled:
                                          IconSunFilled} 
          label="Switch Theme" 
          onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        />
        
        {/* <Tooltip label={user.username} position="right" transitionProps={{ duration: 200 }}>
            <Avatar
                alt="avatar"
                radius="xl"
                size="md"
                src={user.image}
                color="indigo"
              />
        </Tooltip> */}
        <Tooltip label={user.username} position="right" transitionProps={{ duration: 200 }}>
          <UploadButtonWithRef {...uploadProps}></UploadButtonWithRef>
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