import "@/styles/globals.css";
import { type Metadata } from "next";
import { hubotSans, geistSans, geistMono } from "@/styles/fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    template: "%s | UGA Check-In",
    default: "UGA Check-In System for Secure Class Room Attendance",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          hubotSans.variable,
          geistSans.variable,
          geistMono.variable,
          "antialiased font-[family-name:var(--font-geist-sans)]"
        )}
      >
        {children}
      </body>
    </html>
  );
}
