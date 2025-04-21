"use client";

import { useEffect, useState } from "react";

export default function AutoRefresh({ interval = 10 }: { interval?: number }) {
  const [secondsLeft, setSecondsLeft] = useState(interval);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : interval));
    }, 1000);

    const refresh = setInterval(() => {
      window.location.reload();
    }, interval * 1000);

    return () => {
      clearInterval(countdown);
      clearInterval(refresh);
    };
  }, [interval]);

  return (
    <p className="text-sm text-gray-500 mt-4 text-center">
      Refreshing in {secondsLeft} second{secondsLeft !== 1 ? "s" : ""}...
    </p>
  );
}