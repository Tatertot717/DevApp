"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// qr code pattern - 1 for filled cells, 0 for empty
const QR_LOGO_PATTERN = [
  [1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 0, 1],
  [0, 0, 1, 0, 1, 1, 0, 0, 0],
  [1, 1, 0, 1, 0, 1, 0, 1, 1],
  [0, 0, 1, 1, 0, 0, 1, 0, 0],
  [1, 0, 1, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1],
];

export function AnimatedQRLogo() {
  const [key, setKey] = useState(0);

  // reset animation every 4 seconds to create a loop
  useEffect(() => {
    const interval = setInterval(() => {
      setKey((prevKey) => prevKey + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* qr code frame - always visible */}
      <div className="relative h-16 w-16 rounded-lg bg-white p-2 shadow-md">
        {/* animated cells inside the frame */}
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            className="grid h-full w-full grid-cols-9 grid-rows-9 gap-0.5"
          >
            {QR_LOGO_PATTERN.flat().map((cell, index) => (
              <motion.div
                key={`${key}-${index}`}
                className={`${cell ? "bg-black" : "bg-transparent"} rounded-sm`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.01,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* corner squares - animated but separate from cells */}
        <AnimatePresence mode="wait">
          <motion.div key={`corner-${key}`}>
            <motion.div
              className="absolute left-2 top-2 h-4 w-4 rounded-xs border-4 border-black bg-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
            />
            <motion.div
              className="absolute right-2 top-2 h-4 w-4 rounded-xs border-4 border-black bg-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, type: "spring" }}
            />
            <motion.div
              className="absolute bottom-2 left-2 h-4 w-4 rounded-xs border-4 border-black bg-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4, type: "spring" }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export function AnimatedQRLogoWithText() {
  return (
    <div className="flex flex-row gap-4 items-center">
      <AnimatedQRLogo />
      <h1
        className={cn(
          "font-bold text-3xl",
          "font-[family-name:var(--font-hubot-sans)]"
        )}
      >
        QRoll
      </h1>
    </div>
  );
}
