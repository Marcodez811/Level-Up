"use client";
import { UserInfo } from "@/app/components/UserInfo";
import { Container,  Skeleton,  Space, Stack } from "@mantine/core";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Home = () => {
    const pathname = usePathname();
    const userId = pathname.split("/").pop();
    const [user, setUser] = useState(null);

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`/api/user/${userId}`);
          setUser(response.data.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }, [userId]);

    if (!user) {
      return (
        <Stack 
          w={800} 
          h={700}>
          <Skeleton height={50} circle mb="xl" />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </Stack>
      );
    }

    return (
      <>
        <Container fluid>
          <Space h="md"/>
          <UserInfo user={user}/> 
        </Container>
      </>
    )
}

export default Home;