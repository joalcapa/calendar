import type { Metadata } from "next";
import SmallCalendar from "@/app/components/calendar/smallCalendar/smallCaldendarServer";
import CalendarNavigation from '@/app/components/calendar/navigation/navigationClient';
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  searchParams,
}: Readonly<{
  children: React.ReactNode;
  searchParams?: {
    date?: string,
    type?: string,
  },
}>) {
  console.log("date --->", searchParams)
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        {/* Navigation Bar */}
        <CalendarNavigation type={searchParams?.type || "month"} />

        {/* Main Layout */}
        <div className="flex flex-1">
          {/* Small Calendar */}
          {/*<div className="w-1/4 md:w-1/5 p-4">
            <SmallCalendar currentMonth={searchParams && searchParams.date ? new Date(searchParams.date) : new Date()} />
          </div>*/}

          {/* Children Content */}
          <div className="flex-1 p-4">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
