function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const presentationOriginUrl = process.env.SANITY_STUDIO_PRESENTATION_URL;

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-28";

export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3000";

export const title = process.env.SANITY_STUDIO_TITLE || "My Studio";
