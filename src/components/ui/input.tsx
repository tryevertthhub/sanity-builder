import React from "react";
import { cn } from "@/src/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-zinc-500",
        className
      )}
      {...props}
    />
  );
}
