import localFont from 'next/font/local'
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from './components/SessionProvider'


export const metadata = {
  title: "Home | WorkShop",
};

const prompt = localFont({
  src: './Prompt-Light.ttf',
  display: 'swap'
})

export default async function RootLayout({ children }) {

  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={prompt.className}>
        <SessionProvider session={session}>{children}</SessionProvider></body>
    </html>
  );
}
