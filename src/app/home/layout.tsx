import SideBar from "@/app/components/SideBar";
import { redirect } from 'next/navigation';
import getCurrentUser from "../actions/getCurrentUser";
import { Container, Flex } from "@mantine/core";

export default async function PageLayout({
    children
}: {
    children: React.ReactNode;
}) {
    // the current user
    const currentUser = await getCurrentUser();
    if (!currentUser) redirect("/");
    return (
        <SideBar>
            <Container> 
                <Flex justify="center" align="center">
                    {children}
                </Flex>
            </Container>
        </SideBar>
    )
};