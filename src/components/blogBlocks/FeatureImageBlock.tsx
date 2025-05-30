import { cn } from "@/src/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";

interface FeatureImageBlockProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export function FeatureImageBlock({
  src,
  alt,
  caption,
  className,
}: FeatureImageBlockProps) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn("my-12 mx-auto max-w-5xl", className)}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          priority
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-sm text-gray-400">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
