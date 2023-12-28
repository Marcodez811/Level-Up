import Image from "next/image";
import AuthPage from "@/app/components/AuthPage";
import { Title, Container, Space } from "@mantine/core";

export default function Home() {
  return (
    <>
      <Container fluid h="100%">
        <AuthPage />
      </Container>
    </>
  )
}
