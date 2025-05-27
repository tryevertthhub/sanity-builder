import { ImageResponse } from "next/og";
import {
  getGenericPageOGData,
  getHomePageOGData,
  getSlugPageOGData,
  getFaviconData,
} from "./og-data";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    const icon = searchParams.get("icon");

    // Handle favicon request
    if (icon === "true") {
      const [faviconData, faviconError] = await getFaviconData();

      if (faviconError || !faviconData?.logoUrl) {
        return new Response("Logo not found", { status: 404 });
      }

      try {
        const imageData = await fetch(
          faviconData.logoUrl + "?w=32&h=32&fit=crop&auto=format",
        );
        const buffer = await imageData.arrayBuffer();

        return new Response(buffer, {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } catch (error) {
        console.error("Error generating favicon:", error);
        return new Response("Error generating favicon", { status: 500 });
      }
    }

    console.log("OG Image request:", { type, id });

    if (!type || !id) {
      return new Response("Missing type or id parameter", { status: 400 });
    }

    const [data, error] = await (async () => {
      switch (type) {
        case "homePage":
          return getHomePageOGData(id);
        case "page":
          return getSlugPageOGData(id);

        default:
          return getGenericPageOGData(id);
      }
    })();

    console.log("Sanity response:", { data, error });

    if (error || !data?.seoImage) {
      return new Response("Image not found", { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "1200px",
            height: "630px",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            backgroundColor: "#fff",
          }}
        >
          <img
            src={data.seoImage}
            alt={data.title || ""}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />

          {/* <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3))",
              zIndex: 1,
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "90%",
              padding: "20px",
              color: "#fff",
              textAlign: "center",
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {data.logo && (
              <img
                src={data.logo}
                alt=""
                style={{
                  marginBottom: "20px",
                  maxWidth: "240px",
                  maxHeight: "120px",
                }}
              />
            )}
            <h1
              style={{
                fontSize: "64px",
                fontWeight: "bold",
                margin: "0 0 20px",
                lineHeight: "1.2",
              }}
            >
              {data.title}
            </h1>
            {data.description && (
              <p
                style={{
                  fontSize: "32px",
                  margin: 0,
                  maxWidth: "800px",
                }}
              >
                {data.description}
              </p>
            )}
          </div> */}
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control":
            "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
          "Content-Type": "image/png",
        },
      },
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Error generating image", { status: 500 });
  }
}
