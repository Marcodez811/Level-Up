"use client";

import { useState, useCallback, forwardRef } from 'react';
import { useRouter } from 'next/navigation'; 
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

import { Tooltip, UnstyledButton, Stack, useMantineColorScheme, useComputedColorScheme, ActionIcon } from '@mantine/core';
import {
  IconHome2,
  IconDeviceDesktopAnalytics,
  IconSettings,
  IconLogout,
  IconMoonFilled,
  IconSunFilled,
} from '@tabler/icons-react';
import { Avatar } from '@mantine/core';
import classes from './NavbarMinimal.module.css';
import { CldUploadButton, CldUploadWidget, CldImage } from 'next-cloudinary';

import { User } from '@/lib/types/db';

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
  { icon: IconSettings, label: 'Settings' },
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

  // handle user image upload
  const handleUpload = useCallback(
    (result:any) => {
        console.log("========");
        console.log(result.info);
        console.log(result.info.public_id)
        setImgPublicId(result.info.public_id);
    },
    []
  )
  type propType = {
    uploadPreset:string, 
    onUpload:(result: any) => void, 
    user: User
  }
  const UploadButtonWithRef = forwardRef((props:propType) => {
    const {uploadPreset, onUpload, user} = props;
    return(
    <CldUploadButton uploadPreset={uploadPreset} onUpload={onUpload}>
      <Avatar
        alt="avatar"
        radius="xl"
        size="md"
        src={user.image}
        color="indigo"
      />
    </CldUploadButton>
  )});
  
  

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>
      <Stack justify="center" gap={5} align='center'>
        <NavbarLink 
          icon={computedColorScheme === 'light'? 
                                          IconMoonFilled:
                                          IconSunFilled} 
          label="Switch Theme" 
          onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        />
        {/* Warning: forwardRef render functions accept exactly two parameters: props and ref. Did you forget to use the ref parameter?  */}
        {/* <Tooltip label={user.username} position="right" transitionProps={{ duration: 200 }}>
            {user.image===null?(
              <CldUploadButton uploadPreset="s5aw9acw" onUpload={handleUpload} >
                <Avatar
                alt="avatar"
                radius="xl"
                size="md"
                src={user.image}
                color="indigo"
              />
              </CldUploadButton>):<div></div>}
        </Tooltip> */}
        <Tooltip label={user.username} position="right" transitionProps={{ duration: 200 }}>
            <Avatar
                alt="avatar"
                radius="xl"
                size="md"
                src={user.image}
                color="indigo"
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