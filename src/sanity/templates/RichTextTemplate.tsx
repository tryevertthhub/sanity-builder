import { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "../utils/utils";

export const portableTextComponents = {
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-rem my-12 lg:px-[20vw] text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-bold lg:px-[20vw] font-rem my-8 lg:my-12 text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-bold lg:px-[20vw] font-rem my-12  text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl font-bold lg:px-[20vw] font-rem my-12 text-white/90">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-xl lg:px-[20vw] w-full font-outfit leading-relaxed mb-6 text-white/70">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-8 border-l-4 border-purple-500 bg-white/5 p-6 rounded-r-lg italic text-white">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="mb-8 space-y-3  lg:px-[20vw] font-outfit text-xl leading-relaxed text-white/70 list-disc pl-5">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="mb-8 space-y-3 lg:px-[20vw] font-outfit text-xl leading-relaxed list-decimal pl-5 text-white/70">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-bold text-white/95">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-white">{children}</em>
    ),
    code: ({ children }: any) => (
      <code className="px-1.5 py-0.5 font-mono text-sm text-purple-100 bg-purple-500/10 rounded border border-purple-500/20">
        {children}
      </code>
    ),
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target={value?.openInNewTab ? "_blank" : undefined}
        rel={value?.openInNewTab ? "noopener noreferrer" : undefined}
        className="text-purple-400 hover:text-purple-100 underline decoration-purple-400/30 underline-offset-2 transition-colors hover:decoration-purple-100"
      >
        {children}
      </a>
    ),
  },
  types: {
    video: ({
      value,
    }: {
      value: {
        videoFile: { url: string; _type: string } | null;
        caption?: string;
      };
    }) => {
      if (!value.videoFile?.url) {
        return (
          <div className="my-8">
            <p className="text-red-500">Video file not found</p>
          </div>
        );
      }

      return (
        <div className="my-8 lg:px-[10vw]">
          <div className="relative aspect-video w-full">
            <video
              src={value.videoFile.url}
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full rounded-lg object-contain"
              title={value.caption}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          {value.caption && (
            <p className="mt-2 text-sm text-gray-500">{value.caption}</p>
          )}
        </div>
      );
    },
  },
};

export const faqTemplate = {
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-rem my-12  text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-bold  font-rem my-8 lg:my-12 text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-bold font-rem my-12  text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl font-bold font-rem my-12 text-white/90">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-xl w-full font-outfit leading-relaxed mb-6 text-white/70">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-8 border-l-4 border-purple-500 bg-white/5 p-6 rounded-r-lg italic text-white">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="mb-8 space-y-3  font-outfit text-xl leading-relaxed text-white/70 list-disc pl-5">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="mb-8 space-y-3 font-outfit text-xl leading-relaxed list-decimal pl-5 text-white/70">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-bold text-white/95">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-white">{children}</em>
    ),
    code: ({ children }: any) => (
      <code className="px-1.5 py-0.5 font-mono text-sm text-purple-100 bg-purple-500/10 rounded border border-purple-500/20">
        {children}
      </code>
    ),
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target={value?.openInNewTab ? "_blank" : undefined}
        rel={value?.openInNewTab ? "noopener noreferrer" : undefined}
        className="text-purple-400 hover:text-purple-100 underline decoration-purple-400/30 underline-offset-2 transition-colors hover:decoration-purple-100"
      >
        {children}
      </a>
    ),
  },
};

export const careersTemplate = {
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-rem my-12 text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-bold font-rem my-8 lg:my-12 text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-bold font-rem my-12  text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl font-bold font-rem my-12 text-white/90">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-lg  w-full font-outfit leading-relaxed mb-6 text-white/70">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-8 border-l-4 border-purple-500 bg-white/5 p-6 rounded-r-lg italic text-white">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="mb-8 space-y-3  font-outfit text-xl leading-relaxed text-white/70 list-disc pl-5">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="mb-8 space-y-3 font-outfit text-xl leading-relaxed list-decimal pl-5 text-white/70">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-bold text-white/95">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-white">{children}</em>
    ),
    code: ({ children }: any) => (
      <code className="px-1.5 py-0.5 font-mono text-sm text-purple-100 bg-purple-500/10 rounded border border-purple-500/20">
        {children}
      </code>
    ),
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target={value?.openInNewTab ? "_blank" : undefined}
        rel={value?.openInNewTab ? "noopener noreferrer" : undefined}
        className="text-purple-400 hover:text-purple-100 underline decoration-purple-400/30 underline-offset-2 transition-colors hover:decoration-purple-100"
      >
        {children}
      </a>
    ),
  },
};

export const blogTemplate: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const imageUrl = urlFor(value)?.url();
      if (!imageUrl) return null;

      // Get dimensions from the image metadata
      const width = value.dimensions?.width || 800;
      const height = value.dimensions?.height || 600;

      return (
        <div className="relative my-8 lg:px-[10vw]">
          <div
            className="relative w-full overflow-hidden rounded-lg border border-white/10"
            style={{ maxWidth: width, margin: "0 auto" }}
          >
            <div style={{ paddingTop: `${(height / width) * 100}%` }} />
            <Image
              src={imageUrl}
              alt={value.alt || ""}
              fill
              className="absolute top-0 left-0 h-full w-full object-contain"
              sizes={`(max-width: ${width}px) 100vw, ${width}px`}
            />
          </div>
          {value.caption && (
            <p className="mt-3 text-center text-sm text-white/60">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
    video: ({ value }) => {
      return value?.url ? (
        <div className="my-8 lg:px-[10vw]">
          <video
            controls
            className="w-full rounded-lg border border-white/10"
            src={value.url}
            title={value.caption}
          >
            Your browser does not support the video tag.
          </video>
          {value.caption && (
            <p className="mt-3 text-center text-sm text-white/60">
              {value.caption}
            </p>
          )}
        </div>
      ) : null;
    },
    youtube: ({ value }) => {
      if (!value?.url) return null;

      const getYouTubeId = (url: string) => {
        const match = url.match(
          /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
        );
        return match ? match[1] : null;
      };

      const videoId = getYouTubeId(value.url);
      if (!videoId) return null;

      return (
        <div className="my-8 lg:px-[10vw]">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={value.caption || "YouTube video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          {value.caption && (
            <p className="mt-3 text-center text-sm text-white/60">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
    externalLink: ({ value }) => {
      if (!value?.url || !value?.text) return null;

      return (
        <a
          href={value.url}
          className="inline-block text-purple-400 underline decoration-purple-400/50 decoration-2 underline-offset-2 transition-colors hover:text-purple-300 hover:decoration-purple-300"
          target={value.openInNewTab ? "_blank" : undefined}
          rel={value.openInNewTab ? "noopener noreferrer" : undefined}
        >
          {value.text}
        </a>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="font-rem mt-12 mb-6 text-4xl font-bold text-white lg:px-[10vw]">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-rem mt-10 mb-4 text-3xl font-bold text-white lg:px-[10vw]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-rem mt-8 mb-4 text-2xl font-bold text-white/90 lg:px-[10vw]">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-rem mt-6 mb-3 text-xl font-bold text-white/80 lg:px-[10vw]">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="font-outfit mb-4 text-lg leading-relaxed text-white/70 lg:px-[10vw]">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-purple-500 bg-white/5 py-4 pr-4 pl-6 text-white/80 italic lg:ml-[10vw] lg:mr-[10vw]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-white">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-white/90">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-sm text-purple-300 border border-white/20">
        {children}
      </code>
    ),
    underline: ({ children }) => (
      <span className="underline decoration-white/50 decoration-2 underline-offset-2">
        {children}
      </span>
    ),
    "strike-through": ({ children }) => (
      <span className="line-through text-white/60">{children}</span>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-purple-400 underline decoration-purple-400/50 decoration-2 underline-offset-2 transition-colors hover:text-purple-300 hover:decoration-purple-300"
        target={value?.openInNewTab ? "_blank" : undefined}
        rel={value?.openInNewTab ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-inside list-disc space-y-2 text-white/70 lg:px-[10vw]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-inside list-decimal space-y-2 text-white/70 lg:px-[10vw]">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-lg leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-lg leading-relaxed">{children}</li>
    ),
  },
};
