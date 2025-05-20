import { client } from "@/src/sanity/lib/client";
import { handleErrors } from "@/src/sanity/utils/utils";

const ogFieldsFragment = /* groq */ `
  _id,
  _type,
  "title": select(
    defined(ogTitle) => ogTitle,
    defined(seoTitle) => seoTitle,
    title
  ),
  "description": select(
    defined(ogDescription) => ogDescription,
    defined(seoDescription) => seoDescription,
    description
  ),
  "image": image.asset->url + "?w=566&h=566&dpr=2&fit=max",
  "mainImage": mainImage.asset->url + "?w=566&h=566&dpr=2&fit=max",
  "dominantColor": image.asset->metadata.palette.dominant.background,
  "seoImage": seoImage.asset->url + "?w=1200&h=630&dpr=2&fit=max", 
  "logo": *[_type == "settings"][0].logo.asset->url + "?w=80&h=40&dpr=3&fit=max&q=100",
  "date": coalesce(date, _createdAt)
`;

const queryFaviconData = /* groq */ `
  *[_type == "settings"][0]{
    "logoUrl": logo.asset->url
  }
`;

const queryHomePageOGData = /* groq */ `
  *[_type == "homePage" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`;

const querySlugPageOGData = /* groq */ `
  *[_type == "page" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`;

const queryGenericPageOGData = /* groq */ `
  *[ defined(slug.current) && _id == $id][0]{
    ${ogFieldsFragment}
  }
`;

export async function getFaviconData() {
  return await handleErrors(client.fetch(queryFaviconData));
}

export async function getHomePageOGData(id: string) {
  return await handleErrors(client.fetch(queryHomePageOGData, { id }));
}

export async function getSlugPageOGData(id: string) {
  return await handleErrors(client.fetch(querySlugPageOGData, { id }));
}

export async function getGenericPageOGData(id: string) {
  return await handleErrors(client.fetch(queryGenericPageOGData, { id }));
}
