"use client";

import { User } from "@/lib/types/db"
import { Stack, Title, Avatar, Text, PasswordInput, Button, Group, Space, TextInput } from "@mantine/core"
import classes from "./AccountSetting.module.css"
import { CldUploadWidget } from 'next-cloudinary';
import axios from "axios";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

const AccountSetting = ({user} : {user: User}) => {
    const [imgUrl, setImgUrl] = useState(user.image);
    const [disabled, setDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm({
        initialValues: {
            image: '',
            username: '',
            password: '',
            newPassword: '',
            confirmPassword: '',
        },
        validate: {
          newPassword: (val) => ((val.length >= 1 && val.length < 8) ? 'Password should include at least 8 characters' : null),
          confirmPassword: (val) => ((val.length >= 1 && val.length < 8) ? 'Password should include at least 8 characters' : null),
        },
    });

    const handleUpload = (result: any) => {
        setImgUrl(result.info.secure_url);
        form.setFieldValue('image', result.info.secure_url);
        setDisabled(true);
    }
    const handleSubmit = (values: any) => {
        setIsLoading(true);
        if (values.password) {
            if (!values.newPassword || !values.confirmPassword) {
                notifications.show({
                    title: "Error",
                    message: "You need to fill the passwords!",
                    color: "red",
                })
                setIsLoading(false);
                return;
            }
            if (values.newPassword !== values.confirmPassword) {
                notifications.show({
                    title: "Error",
                    message: "Confirm password doesn't match new password!",
                    color: "red",
                });
                setIsLoading(false);
                return;
            }
        }
        axios.post("/api/setting", values)
        .then(() => {
            router.refresh();
            notifications.show({
                title: "Success",
                message: "Updated your data!",
                color: "green",
            });
        })
        .catch(() => {
            notifications.show({
                title: "Error",
                message: "Something went wrong while updating your data!",
                color: "red",
            });
        })
        .finally(() => {
            setIsLoading(false);
            setDisabled(false);
        });
    }

    return (
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Stack 
                w={800} 
                h={700}
                className={classes.sectionBorder}
            >
                <Title order={4}>{"Account Panel"}</Title>
                <Space h={5}/>
                <Title order={5}>{"Update Avatar"}</Title>
                <Group>
                    <Avatar
                        alt="Avatar"
                        src={imgUrl}
                        size="xl"
                    />
                        <CldUploadWidget 
                            options={{ maxFiles: 1 }}
                            onUpload={handleUpload}
                            uploadPreset="s5aw9acw">
                                {({ open }) => {
                                    return (
                                        <Button 
                                            variant="default" 
                                            onClick={() => open()}
                                            disabled={disabled || isLoading}>
                                            Upload
                                        </Button>
                                    );
                                }}
                        </CldUploadWidget>
                </Group>
                <Space h={10}/>
                <Title order={5}>{"Update Username"}</Title>
                    <TextInput 
                        disabled={isLoading}
                        onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
                        placeholder="New Username"
                        w="50%"
                    />
                <Space h={10}/>
                <Title order={5}>{"Update Password"}</Title>
                <Text size="xs" c="dimmed">*Only Avaliable for Credential Users*</Text>
                <PasswordInput 
                    disabled={isLoading || user.provider !== "credentials"}
                    onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                    placeholder="Old Password"
                    w="50%"
                />
                <PasswordInput 
                    disabled={isLoading || user.provider !== "credentials"}
                    onChange={(event) => form.setFieldValue('newPassword', event.currentTarget.value)}
                    placeholder="New Password"
                    error={form.errors.newPassword && 'Password should include at least 8 characters'}
                    w="50%"
                />
                <PasswordInput 
                    disabled={isLoading || user.provider !== "credentials"}
                    onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
                    placeholder="Confirm Password"
                    error={form.errors.confirmPassword && 'Password should include at least 8 characters'}
                    w="50%"
                />
                <Space h={15}/>
                <Button 
                    variant="gradient"
                    gradient={{ from: 'indigo', to: 'violet', deg: 90 }}
                    type="submit"
                >
                    Save
                </Button>
            </Stack>
        </form>
    )
}

export default AccountSetting;