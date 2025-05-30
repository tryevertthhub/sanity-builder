import { cn } from "@/src/lib/utils";

interface CalloutBlockProps {
  type?: "info" | "warning" | "success" | "error";
  title?: string;
  content: string;
  className?: string;
}

export function CalloutBlock({
  type = "info",
  title,
  content,
  className,
}: CalloutBlockProps) {
  const typeStyles = {
    info: "border-blue-500/20 bg-blue-500/10 text-blue-200",
    warning: "border-yellow-500/20 bg-yellow-500/10 text-yellow-200",
    success: "border-green-500/20 bg-green-500/10 text-green-200",
    error: "border-red-500/20 bg-red-500/10 text-red-200",
  };

  return (
    <div
      className={cn(
        "my-8 rounded-lg border p-6 shadow-lg",
        typeStyles[type],
        className
      )}
    >
      {title && <h3 className="mb-2 text-lg font-semibold">{title}</h3>}
      <p className="text-base leading-relaxed">{content}</p>
    </div>
  );
}
