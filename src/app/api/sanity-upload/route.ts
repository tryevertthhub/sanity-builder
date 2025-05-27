import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_WRITE_TOKEN, // This is your write token
  useCdn: false,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const asset = await client.assets.upload("image", file, {
      contentType: file.type,
      filename: file.name,
    });
    return NextResponse.json({ asset });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
