import { Hubot_Sans, Geist, Geist_Mono } from "next/font/google";

// const geistSans = Geist({
// variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

export const hubotSans = Hubot_Sans({
  variable: "--font-hubot-sans",
  subsets: ["latin"],
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  // weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400"],
});
