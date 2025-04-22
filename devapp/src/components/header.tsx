"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-red-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <Link href="/">
        <h1 className="text-2xl font-bold">UGA Check-In</h1>
      </Link>
      <nav className="space-x-4">
        <Link href="/auth/login">
          <span className="hover:underline cursor-pointer">Log In</span>
        </Link>
        <Link href="/signup">
          <span className="bg-white text-red-800 font-semibold px-4 py-1 rounded hover:bg-gray-100 transition">
            Sign Up
          </span>
        </Link>
      </nav>
    </header>
  );
}
