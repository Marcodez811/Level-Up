"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button, TextInput, Stack, Center, Title, Space, Text, Group } from "@mantine/core";
import { useInputState } from '@mantine/hooks';
import { GoogleButton } from "./GoogleButton";
import { GithubButton } from "./GithubButton";
import Image from "next/image";

type FormVariant = 'login' | 'register';

export default function AuthPage() {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<FormVariant>("login");
    const [isLoading, setIsLoading] = useState(false);
    const [emailValue, setEmailValue] = useInputState('');
    const [nameValue, setNameValue] = useInputState('');
    const [passwordValue, setPasswordValue] = useInputState('');

    useEffect(() => {
        if (session?.status === 'authenticated') {
            router.push('/home');
        }
    }, [session?.status, router]);

    const switchVariant = useCallback(() => {
        setVariant(variant === "login" ? "register" : "login");
    }, [variant]);

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        if (variant === 'register') {
            const data = {
                email: emailValue,
                password: passwordValue,
                username: nameValue
            };
            await axios.post("/api/register", data)
                        .then(() => signIn('credentials', data))
                        .catch(() => toast.error("Someone has registered with this email or username"))
                        .finally(() => setIsLoading(false));;
        } else {
            const data = {
                email: emailValue,
                password: passwordValue,
            };
            await signIn("credentials", {
                ...data,
                redirect: false
            }).then((callback) => {
                if (callback?.error) {
                    toast.error("Invalid Credentials");
                } else {
                    if (callback?.ok) {
                        router.push("/home");
                    }
                }
            })
            .catch(callback => {
                if (callback?.error) {
                    toast.error("Invalid Credentials");
                } else {
                    if (callback?.ok) {
                        router.push("/home");
                    }
                }
            })
            .finally(() => setIsLoading(false));
        }

        setIsLoading(false);
    }

    const socialAction = async (action: string) => {
        setIsLoading(true);
        await signIn(action, { redirect: false })
        .then((callback) => {
            if (callback?.error) {
                toast.error("Invalid Credentials");
            } else {
                if (callback?.ok) {
                    router.push("/dashboard");
                }
            }
        })
        .finally(() => setIsLoading(false));
    }


    return (
        <Center style={{ minHeight: '100vh' }} >
            <Stack>
                <Title order={1}>Welcome to Level Up</Title>
                <Title order={4} c="violet">Join us and take your productivity to the next level...</Title>
            </Stack>
            <Space w="xl"/>
            <Stack gap="md" p="md" w={500}>
                <TextInput 
                    value={emailValue}
                    onChange={setEmailValue}
                    id="email" 
                    label="Email Address"
                    type="email"
                    disabled={isLoading}
                />
                {variant === 'register' &&
                    <TextInput 
                        value={nameValue}
                        onChange={setNameValue}
                        id="username" 
                        label="Username"
                        disabled={isLoading}
                    />
                }
                <TextInput 
                    value={passwordValue}
                    onChange={setPasswordValue}
                    id="password" 
                    label="Password"
                    type="password" 
                    disabled={isLoading}
                />
                <Button 
                    fullWidth
                    disabled={isLoading}
                    type="submit"
                    bg="violet"
                    onClick={onSubmit}
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
    );
}