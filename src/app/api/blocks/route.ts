import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { BLOCKS } from "@/src/components/blocks";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    const blocks = [];
    for (const [key, block] of Object.entries(BLOCKS)) {
      if (type && key !== type) continue;

      // Convert camelCase to PascalCase and handle the Block suffix
      const pascalCaseName =
        key.charAt(0).toUpperCase() +
        key.slice(1).replace(/[A-Z]/g, (letter) => letter);
      // Only add "Block" if it's not already there
      const blockDirName = pascalCaseName.endsWith("Block")
        ? pascalCaseName
        : pascalCaseName + "Block";

      const componentPath = path.join(
        process.cwd(),
        "src/components/blocks",
        blockDirName,
        "index.tsx"
      );
      const schemaPath = path.join(
        process.cwd(),
        "src/components/blocks",
        blockDirName,
        "schema.ts"
      );

      try {
        const [componentCode, schemaCode] = await Promise.all([
          fs.readFile(componentPath, "utf-8"),
          fs.readFile(schemaPath, "utf-8"),
        ]);

        blocks.push({
          name: key,
          code: componentCode,
          schema: schemaCode,
        });
      } catch (error) {
        console.error(`Error reading files for block ${blockDirName}:`, error);
        // Continue with other blocks if one fails
        continue;
      }
    }

    return NextResponse.json({ blocks });
  } catch (error) {
    console.error("Error reading block files:", error);
    return NextResponse.json(
      { error: "Failed to read block files" },
      { status: 500 }
    );
  }
}
