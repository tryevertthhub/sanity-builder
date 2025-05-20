"use server";

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/src/sanity/lib/api";

// Create write client on the server side where we can access the token
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

export async function createPage(
  document: any,
  type: "page" | "homePage" = "page"
) {
  try {
    // If it's homepage, we need to handle it differently
    if (type === "homePage") {
      // Check if homepage already exists
      const existingHomePage = await writeClient.fetch(
        `*[_type == "homePage" && _id == "homePage"][0]`
      );

      if (existingHomePage) {
        // Update existing homepage
        const updatedDoc = await writeClient
          .patch("homePage")
          .set({
            ...document,
            _type: "homePage",
          })
          .commit();

        return { success: true, pageDoc: updatedDoc };
      } else {
        // Create new homepage with fixed _id
        const homeDoc = await writeClient.create({
          ...document,
          _id: "homePage",
          _type: "homePage",
        });

        return { success: true, pageDoc: homeDoc };
      }
    }

    // For regular pages
    const pageDoc = await writeClient.create({
      ...document,
      _type: "page",
    });

    // Verify slug was created
    const verifySlug = await writeClient.fetch(
      `*[_type == "page" && _id == $id][0].slug.current`,
      { id: pageDoc._id }
    );

    if (!verifySlug) {
      await writeClient
        .patch(pageDoc._id)
        .set({
          slug: {
            _type: "slug",
            current: document.slug.current,
          },
        })
        .commit();
    }

    return { success: true, pageDoc };
  } catch (error) {
    console.error("Error creating page:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
