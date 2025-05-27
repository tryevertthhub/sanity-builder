import type { PortableTextBlock } from "next-sanity";
import slugify from "slugify";
import type { Image } from "sanity";
import { dataset, projectId } from "../lib/api";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "../lib/client";

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export const fileUrlFor = (ref: string | null | undefined) => {
  if (!ref) return undefined;

  const parts = ref.split("-");
  const fileId = parts[1];
  const fileExtension = parts[parts.length - 1];

  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileId}.${fileExtension}`;
};

export function urlForOpenGraphImage(image: Image | undefined) {
  return urlFor(image)?.width(1200).height(627).fit("crop").url();
}

export function resolveHref(
  documentType?: string,
  slug?: string,
): string | undefined {
  switch (documentType) {
    case "home":
      return "/";
    case "blogs":
      return slug ? `/blogs/${slug}` : undefined;
    case "videos":
      return slug ? `/videos/${slug}` : undefined;
    case "team":
      return slug ? `/team/${slug}` : undefined;
    default:
      console.warn("Invalid document type:", documentType);
      return undefined;
  }
}

export const isRelativeUrl = (url: string) =>
  url.startsWith("/") || url.startsWith("#") || url.startsWith("?");

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    console.log(e);
    return isRelativeUrl(url);
  }
};

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const getTitleCase = (name: string) => {
  const titleTemp = name.replace(/([A-Z])/g, " $1");
  return titleTemp.charAt(0).toUpperCase() + titleTemp.slice(1);
};

type Response<T> = [T, undefined] | [undefined, string];

export async function handleErrors<T>(
  promise: Promise<T>,
): Promise<Response<T>> {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (err) {
    return [
      undefined,
      err instanceof Error ? err.message : JSON.stringify(err),
    ];
  }
}

export function convertToSlug(
  text?: string,
  { fallback }: { fallback?: string } = { fallback: "top-level" },
) {
  if (!text) return fallback;
  return slugify(text.trim(), {
    lower: true,
    remove: /[^a-zA-Z0-9 ]/g,
  });
}

export function parseChildrenToSlug(children: PortableTextBlock["children"]) {
  if (!children) return "";
  return convertToSlug(children.map((child) => child.text).join(""));
}
