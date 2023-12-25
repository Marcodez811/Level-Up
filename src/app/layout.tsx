import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@mantine/core/styles.css';
import { SessionProvider } from "next-auth/react";
import { MantineProvider, ColorSchemeScript, createTheme } from "@mantine/core";
import ToasterContext from './context/ToasterContext';
const inter = Inter({ subsets: ['latin'] })
const theme = createTheme({
  fontFamily: "inherit" 
});
export const metadata: Metadata = {
  title: 'Level Up!',
  description: '...',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <ColorSchemeScript />
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
      />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <ToasterContext/>
          <MantineProvider theme={theme}>{children}</MantineProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
