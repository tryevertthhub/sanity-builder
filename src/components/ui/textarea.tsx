import React from "react";
import { cn } from "@/src/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-zinc-500 min-h-[100px] resize-vertical",
        className
      )}
      {...props}
    />
  );
}
