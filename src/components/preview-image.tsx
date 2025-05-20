import Image, { type ImageProps } from "next/image";
import { SanityImage } from "./sanity-image";

type PreviewImageProps = {
  image: any;
  alt?: string;
  width?: number;
  height?: number;
} & Omit<ImageProps, "src" | "alt">;

export function PreviewImage({
  image,
  alt,
  width,
  height,
  ...props
}: PreviewImageProps) {
  // If the image has a direct URL (for preview/mock data), use Next.js Image directly
  if (image?.asset?.url) {
    return (
      <Image
        src={image.asset.url}
        alt={alt || image.alt || "Preview image"}
        width={width || 1600}
        height={height || 900}
        {...props}
      />
    );
  }

  // Otherwise, use SanityImage for Sanity asset references
  return (
    <SanityImage
      asset={image}
      alt={alt}
      width={width}
      height={height}
      {...props}
    />
  );
}
