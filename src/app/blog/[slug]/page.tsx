import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import BlogClient from "./client";
import { client } from "../../../sanity/lib/client";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

async function getblog(slug: string) {
  const query = groq`
    *[_type == "blog" && slug.current == $slug][0] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      slug,
      mainImage {
        asset->{
          _id,
          url,
          metadata {
            dimensions
          }
        },
        hotspot,
        crop
      },
      content[] {
        ...,
        _type == "image" => {
          "url": asset->url,
          "dimensions": asset->metadata.dimensions,
          "alt": alt,
          "caption": caption
        },
        markDefs[] {
          ...,
          _type == "link" => {
            "href": href,
            "openInNewTab": openInNewTab
          }
        }
      },
      publishedAt,
      excerpt,
      "estimatedReadingTime": round(length(pt::text(content)) / 5 / 180)
    }
  `;

  return client.fetch(query, { slug });
}

export async function generateMetadata({ params }: Props) {
  try {
    const resolvedParams = await params;
    const blog = await getblog(resolvedParams.slug);

    if (!blog) {
      return {
        title: "Not Found",
        description: "The page you are looking for does not exist.",
      };
    }

    return {
      title: blog.title,
      description: blog.excerpt,
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        type: "article",
        publishedTime: blog.publishedAt,
        modifiedTime: blog._updatedAt,
        images: blog.mainImage?.asset?.url
          ? [
              {
                url: blog.mainImage.asset.url,
                width: blog.mainImage.asset.metadata.dimensions.width,
                height: blog.mainImage.asset.metadata.dimensions.height,
                alt: blog.title,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.excerpt,
        images: blog.mainImage?.asset?.url ? [blog.mainImage.asset.url] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "Failed to load blog metadata",
    };
  }
}

export default async function blogPage({ params }: Props) {
  try {
    const resolvedParams = await params;
    const blog = await getblog(resolvedParams.slug);

    if (!blog) {
      notFound();
    }

    return <BlogClient blog={blog} />;
  } catch (error) {
    console.error("Error loading blog:", error);
    return <div>Error loading blog</div>;
  }
}
