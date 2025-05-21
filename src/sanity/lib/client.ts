import type { SanityImageSource } from "@sanity/asset-utils";
import createImageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./api";

const studioUrl = "/studio";

// Add debug logging
console.log('Sanity Client Config:', {
  projectId,
  dataset,
  apiVersion,
  hasReadToken: !!process.env.SANITY_API_READ_TOKEN,
  tokenLength: process.env.SANITY_API_READ_TOKEN?.length
});

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
  stega: {
    studioUrl,
    enabled: process.env.NEXT_PUBLIC_VERCEL_ENV === "preview",
  },
  token: process.env.SANITY_API_READ_TOKEN,
});

export const edgeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  token: process.env.SANITY_API_READ_TOKEN,
});

const imageBuilder = createImageUrlBuilder({
  projectId: projectId,
  dataset: dataset,
});

export const urlFor = (source: SanityImageSource) =>
  imageBuilder.image(source).auto("format").fit("max").format("webp");
