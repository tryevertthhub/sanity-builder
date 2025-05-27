import { notFound } from "next/navigation";

import { PageBuilder } from "@/src/components/pagebuilder";
import { client } from "@/src/sanity/lib/client";
import { sanityFetch } from "@/src/sanity/lib/live";
import { querySlugPageData, querySlugPagePaths } from "@/src/sanity/lib/query";
import { getMetaData } from "@/src/sanity/utils/seo";

async function fetchSlugPageData(slug: string) {
  return await sanityFetch({
    query: querySlugPageData,
    params: { slug: `/${slug}` },
  });
}

async function fetchSlugPagePaths() {
  const slugs = await client.fetch(querySlugPagePaths);
  const paths: { slug: string[] }[] = [];
  for (const slug of slugs) {
    if (!slug) continue;
    const parts = slug.split("/").filter(Boolean);
    paths.push({ slug: parts });
  }
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugString = slug.join("/");
  const { data: pageData } = await fetchSlugPageData(slugString);
  if (!pageData) {
    return getMetaData({});
  }
  return getMetaData(pageData);
}

export async function generateStaticParams() {
  try {
    const paths = await fetchSlugPagePaths();
    // Filter out any paths that might conflict with the root path
    return paths.filter(
      (path) =>
        path.slug.length > 0 &&
        path.slug[0] !== "" &&
        path.slug.join("/") !== "",
    );
  } catch (error) {
    console.error("Error generating static paths:", error);
    // Return an empty array if there's an error or no content
    return [];
  }
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugString = slug.join("/");
  const { data: pageData } = await fetchSlugPageData(slugString);

  if (!pageData) {
    return notFound();
  }

  const { title, pageBuilder, _id, _type } = pageData ?? {};

  return !Array.isArray(pageBuilder) || pageBuilder?.length === 0 ? (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
      <h1 className="text-2xl font-semibold mb-4 capitalize">{title}</h1>
      <p className="text-muted-foreground mb-6">
        This page has no content blocks yet.
      </p>
    </div>
  ) : (
    <PageBuilder
      pageBuilder={pageBuilder}
      id={_id}
      type={_type}
      isEditMode={false}
    />
  );
}
