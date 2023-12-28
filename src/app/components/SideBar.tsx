import type { User } from "@/lib/types/db";
import getCurrentUser from "../actions/getCurrentUser";
import { Navbar } from "./Navbar";
import { redirect } from 'next/navigation';
import { Container, Flex, Stack, Title, Space } from "@mantine/core";
import { RankTable } from "./RankTable";
import classes from "./RankBorder.module.css";
import getAllUsers from "../actions/getAllUsers";

async function SideBar({children}: {
    children: React.ReactNode;
}) {
    const currentUser = await getCurrentUser();
    if (!currentUser) redirect("/");
    const rankings = await getAllUsers();
    return (
        <Flex justify="space-between">
            <Navbar user={currentUser as User}/>
            <Container py={20} fluid>
                {children}
            </Container>
            <Stack align="center" p={20} className={classes.decorate}>
                <Space h="md"/>
                <Title order={3}>Top Users 🔥</Title>
                <RankTable users={rankings}/>
            </Stack>
        </Flex>
    )
}

export default SideBar;