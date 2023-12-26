import SideBar from "@/app/components/SideBar";
import { redirect } from 'next/navigation';
import getCurrentUser from "../../actions/getCurrentUser";
import { Flex, Title, Center, Space } from "@mantine/core";
import motivationalQuotes from "@/lib/utils/motivationQuotes";

export default async function PageLayout({
    children
}: {
    children: React.ReactNode;
}) {
    // the current user
    const currentUser = await getCurrentUser();
    if (!currentUser) redirect("/");
    const getRandomQuote = (): string => {
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        return motivationalQuotes[randomIndex];
    };
    const quote = getRandomQuote();
    return (
        <SideBar>
            <Center>
                <Title order={3}>{quote}</Title>
            </Center>
            <Space h="xl"/>
            <Flex justify="center" align="center">
                {children}
            </Flex>
        </SideBar>
    )
};