"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { notifications } from '@mantine/notifications';
import { useRouter } from "next/navigation";
import { Button, TextInput, Stack, Center, Title, Space, Text, Group } from "@mantine/core";
import { GoogleButton } from "./GoogleButton";
import { GithubButton } from "./GithubButton";
import { useForm } from '@mantine/form';

type FormVariant = 'login' | 'register';

export default function AuthPage() {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<FormVariant>("login");
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        initialValues: {
            username: "",
            email: "",
            password: ""
        },
    
        validate: {
          email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    useEffect(() => {
        if (session?.status === 'authenticated') {
            router.push('/home');
        }
    }, [session?.status, router]);

    const switchVariant = useCallback(() => {
        setVariant(variant === "login" ? "register" : "login");
    }, [variant]);

    const onSubmit = (data: {username: string; password: string; email: string;}) => {
        setIsLoading(true);
        if (variant === 'register') {
            axios.post("/api/register", data)
                 .then(() => signIn('credentials', data))
                 .catch(() => notifications.show({
                    title: "Error",
                    message: "Someone has registered with this email or username",
                    color: "red"
                 }))
                 .finally(() => setIsLoading(false));
        } else {
            signIn("credentials", {
                ...data,
                redirect: true,
            })
            .then((callback) => {
                if (callback?.error) {
                    notifications.show({
                        title: "Error",
                        message: "Invalid Credentials!",
                        color: "red"
                    });
                } else {
                    if (callback?.ok) {
                        router.push("/chats");
                    }
                }
            })
            .finally(() => setIsLoading(false));
        }
    }

    const socialAction = (action: string) => {
        setIsLoading(true);
        signIn(action, { redirect: false })
        .then((callback) => {
            if (callback?.error) {
                notifications.show({
                    title: "Error",
                    message: "Invalid Credentials!",
                    color: "red"
                });
            } else {
                if (callback?.ok) {
                    router.push("/home");
                }
            }
        })
        .finally(() => setIsLoading(false));
    }

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <Center style={{ minHeight: '100vh' }} >
                <Stack>
                    <Title order={1}>Welcome to Level Up</Title>
                    <Title order={4} c="violet">Join us and take your productivity to the next level...</Title>
                </Stack>
                <Space w="xl"/>
                <Stack gap="md" p="md" w={500}>
                    <TextInput 
                        label="Email Address" 
                        disabled={isLoading}
                        {...form.getInputProps('email')} 
                    />
                    {variant === 'register' &&
                        <TextInput 
                            label="Username"
                            disabled={isLoading}
                            {...form.getInputProps('username')} 
                        />
                    }
                    <TextInput 
                        label="Password"
                        type="password" 
                        disabled={isLoading}
                        {...form.getInputProps('password')} 
                    />
                    <Button 
                        fullWidth
                        disabled={isLoading}
                        type="submit"
                        bg="violet"
                    >
                        {variant === 'register'? "Register": "Sign in"}
                    </Button>
                    <Group>
                        <Text size="sm">
                            or continue with
                        </Text>
                        <GoogleButton 
                            radius="xl"
                            onClick={() => socialAction("google")}
                            >
                            Google
                        </GoogleButton>
                        <GithubButton 
                            radius="xl"
                            onClick={() => socialAction("github")}
                            >
                            Github
                        </GithubButton>
                    </Group>
                    <Group>
                        <Text size="sm">{variant === 'login' ? 'New to town?' : 'Already have an account?'}</Text>
                        <Text 
                            size="sm" 
                            onClick={switchVariant}
                            style={{cursor: "pointer"}}
                            td="underline">
                                {variant === 'login' ? 'Create an account' : 'Sign in'}
                        </Text>
                    </Group>
                </Stack>
            </Center>
        </form>
    );
}