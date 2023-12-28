import type { ButtonProps } from '@mantine/core';
import { Button } from '@mantine/core';
import { BsGithub } from "react-icons/bs";

export function GithubButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <Button
      leftSection={<BsGithub style={{ width: '1rem', height: '1rem' }} />}
      variant="default"
      {...props}
    />
  );
}