import { User } from "@/lib/types/db";
import getCurrentUser from "../actions/getCurrentUser";
import { Navbar } from "./Navbar";
import { redirect } from 'next/navigation';
import { Container, Flex, Stack, Title, Space } from "@mantine/core";
import { RankTable } from "./RankTable";
import classes from "./RankBorder.module.css";

async function SideBar({children}: {
    children: React.ReactNode;
}) {
    const currentUser = await getCurrentUser();
    if (!currentUser) redirect("/");
    return (
        <Flex justify="space-between">
            <Navbar user={currentUser as User}/>
            <Container py={20}>
                {children}
            </Container>
            <Stack align="center" p={20} className={classes.decorate}>
                <Space h="md"/>
                <Title order={3}>Top Users 🔥</Title>
                {/* change the content in users to the data returned by getAllUsers.ts */}
                <RankTable users={[currentUser as User]}/>
            </Stack>
        </Flex>
    )
}

export default SideBar;