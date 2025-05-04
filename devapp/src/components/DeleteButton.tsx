"use client";

import { useState } from "react";

type DeleteButtonProps = {
  action: string;                // API endpoint
  body: Record<string, string>; // Body
  redirectTo?: string;          // callback
  confirmMessage?: string;      // Optional message
  className?: string;
};

export function DeleteButton({
  action,
  body,
  redirectTo,
  confirmMessage = "Are you sure you want to delete this?",
  className,
}: DeleteButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm(confirmMessage);
    if (!confirmed) return;

    setIsSubmitting(true);

    const res = await fetch(action, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(body),
    });

    if (res.redirected && redirectTo) {
      window.location.href = redirectTo;
    } else if (res.redirected) {
      window.location.href = res.url;
    } else {
      alert("Delete failed.");
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isSubmitting}
      className={className || "text-red-600 hover:underline text-sm"}
    >
      {isSubmitting ? "Deleting..." : "Delete"}
    </button>
  );
}
