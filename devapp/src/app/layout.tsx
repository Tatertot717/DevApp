import "./globals.css";
import { type Metadata } from "next";
import { Hubot_Sans, Geist, Geist_Mono } from "next/font/google";

// const geistSans = Geist({
// variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

const hubotSans = Hubot_Sans({
  variable: "--font-hubot-sans",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  // weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400"],
});

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
        className={`${hubotSans.variable} ${geistSans.variable} ${geistMono.variable} antialiased dark font-[family-name:var(--font-geist-sans)]`}
      >
        {children}
      </body>
    </html>
  );
}
