"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import React from "react";

type HeaderProps = {
  loggedInItems?: React.ReactNode;
  loggedOutItems?: React.ReactNode;
};

export default function LandingHeader({ loggedInItems, loggedOutItems }: HeaderProps) {
  const { user, isLoading } = useUser();

  return (
    <header className="bg-red-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <Link href="/">
        <h1 className="text-2xl font-bold">UGA Check-In</h1>
      </Link>

      {!isLoading && (
        <nav className="space-x-4">
          {user ? (
            loggedInItems ?? (
              <>
                <Link href="/dashboard">
                  <span className="hover:underline cursor-pointer">Dashboard</span>
                </Link>
                <Link href="/auth/logout">
                  <span className="bg-white text-red-800 font-semibold px-4 py-1 rounded hover:bg-gray-100 transition">Log Out</span>
                </Link>
              </>
            )
          ) : (
            loggedOutItems ?? (
              <>
                <Link href="/auth/login">
                  <span className="hover:underline cursor-pointer">Log In</span>
                </Link>
                <Link href="/auth/login">
                  <span className="bg-white text-red-800 font-semibold px-4 py-1 rounded hover:bg-gray-100 transition">Sign Up</span>
                </Link>
              </>
            )
          )}
        </nav>
      )}
    </header>
  );
}
