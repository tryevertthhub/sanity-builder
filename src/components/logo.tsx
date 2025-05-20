import Image from "next/image";

import { SanityImage } from "./sanity-image";

interface LogoProps {
  src?: any;
  image?: any;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function Logo({
  src,
  alt = "logo",
  image,
  width = 130,
  height = 28,
  priority = true,
}: LogoProps) {
  if (image?.asset) {
    return (
      <SanityImage
        asset={image}
        alt={alt}
        width={width}
        height={height}
        className="object-contain"
        priority={priority}
        loading="eager"
        decoding="sync"
        quality={100}
      />
    );
  }

  return (
    <Image
      src="/cascade.png"
      alt={alt}
      width={width}
      height={height}
      className="object-contain"
      loading="eager"
      priority={priority}
      decoding="sync"
    />
  );
}
