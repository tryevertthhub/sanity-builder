import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";

interface PullQuoteBlockProps {
  quote: string;
  author?: string;
  className?: string;
}

export function PullQuoteBlock({
  quote,
  author,
  className,
}: PullQuoteBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn("my-16 mx-auto max-w-3xl px-4 text-center", className)}
    >
      <blockquote className="relative">
        <div className="absolute -left-4 -top-4 text-6xl text-gray-400/20">
          "
        </div>
        <p className="text-2xl font-serif italic leading-relaxed text-gray-200">
          {quote}
        </p>
        <div className="absolute -right-4 -bottom-4 text-6xl text-gray-400/20">
          "
        </div>
      </blockquote>
      {author && <div className="mt-4 text-sm text-gray-400">— {author}</div>}
    </motion.div>
  );
}
