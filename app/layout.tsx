import type { Metadata } from "next";
import CalendarNavigation from '@/app/components/calendar/navigation/navigationClient';
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CalendarNavigation />
        {children}
      </body>
    </html>
  );
}
