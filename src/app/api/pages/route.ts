import { NextResponse } from "next/server";
import { client } from "@/src/sanity/lib/client";
import { groq } from "next-sanity";

export async function GET() {
  try {
    const query = groq`*[_type == "page"] {
      _id,
      title,
      "slug": slug.current,
      _updatedAt
    }`;

    const pages = await client.fetch(query);
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 },
    );
  }
}
