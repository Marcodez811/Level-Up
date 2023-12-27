"use client";
import { Container,  Space } from "@mantine/core";
import { useSession } from "next-auth/react";
import { User } from "@/lib/types/db";
import AccountSetting from "../components/AccountSetting";

const Home = () => {
    const session = useSession();
    if (!session.data) return;
    if (!session.data.user) return;
    return (
      <>
        <Container fluid>
          <Space h="md"/>
          <div style={{borderBottom: "rem(1px) solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))"}}/>
          <AccountSetting user={session.data.user as User}/>
        </Container>
      </>
    )
}

export default Home;