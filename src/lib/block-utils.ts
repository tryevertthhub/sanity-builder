import fs from "fs/promises";
import path from "path";
import { type SchemaTypeDefinition } from "sanity";

// Define types for our schema and field structures
type SanityField = {
  name: string;
  type: string;
  title?: string;
  options?: Record<string, any>;
  validation?: { required?: boolean };
  of?: Array<{ type: string }>;
  fields?: SanityField[];
};

type SanitySchema = {
  name: string;
  type: string;
  fields?: SanityField[];
};

type SampleData = {
  _type: string;
  title?: string;
  description?: string;
  richText?: Array<{
    _type: string;
    style: string;
    children: Array<{
      _type: string;
      text: string;
    }>;
  }>;
  buttons?: Array<{
    _key: string;
    text: string;
    variant: string;
    url: {
      type: string;
      external: string;
      openInNewTab: boolean;
    };
  }>;
  [key: string]: any;
};

export async function getBlockCode(blockType: string) {
  try {
    const blockDir = path.join(
      process.cwd(),
      "src/components/blocks",
      blockType
    );

    // Read component code
    const componentPath = path.join(blockDir, "index.tsx");
    const componentCode = await fs.readFile(componentPath, "utf-8");

    // Read schema code
    const schemaPath = path.join(blockDir, "schema.ts");
    const schemaCode = await fs.readFile(schemaPath, "utf-8");

    return {
      component: componentCode,
      schema: schemaCode,
    };
  } catch (error) {
    console.error(`Error reading block code for ${blockType}:`, error);
    return {
      component: "// Error reading component code",
      schema: "// Error reading schema code",
    };
  }
}

export function formatBlockName(name: string) {
  return name.replace(/([A-Z])/g, " $1").trim();
}

// Generate sample data based on field type
function generateSampleValue(field: SanityField): any {
  switch (field.type) {
    case "string":
      return field.options?.list ? field.options.list[0] : "Sample Text";
    case "text":
      return "Sample long text content that demonstrates what this field might contain in a real scenario.";
    case "number":
      return 42;
    case "boolean":
      return true;
    case "image":
      return {
        _type: "image",
        asset: {
          _ref: "sample-image",
          _type: "reference",
        },
        alt: "Sample Image",
      };
    case "array":
      if (field.of) {
        // For arrays, generate 2 sample items
        return [
          generateSampleValue({ type: field.of[0].type, name: "sample" }),
          generateSampleValue({ type: field.of[0].type, name: "sample" }),
        ];
      }
      return [];
    case "object":
      if (field.fields) {
        return generateSampleDataFromFields(field.fields);
      }
      return {};
    case "reference":
      return {
        _type: "reference",
        _ref: "sample-reference",
      };
    default:
      return null;
  }
}

// Generate sample data from schema fields
function generateSampleDataFromFields(
  fields: SanityField[]
): Record<string, any> {
  const sampleData: Record<string, any> = {};

  fields.forEach((field) => {
    sampleData[field.name] = generateSampleValue(field);
  });

  return sampleData;
}

// Generate sample data for a block based on its schema
export function generateSampleBlockData(
  schema: SanitySchema,
  type: string
): SampleData {
  const sampleData: SampleData = {
    _type: type,
    ...generateSampleDataFromFields(schema.fields || []),
  };

  // Add specific sample data for common field names
  if (sampleData.title) {
    sampleData.title = `Sample ${formatBlockName(type)}`;
  }
  if (sampleData.description) {
    sampleData.description = `This is a sample ${formatBlockName(type).toLowerCase()} that demonstrates how this block looks with example content.`;
  }
  if (sampleData.richText) {
    sampleData.richText = [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "This is a sample rich text block with some example content. It demonstrates how text will appear in this block.",
          },
        ],
      },
    ];
  }
  if (sampleData.buttons) {
    sampleData.buttons = [
      {
        _key: "button1",
        text: "Primary Action",
        variant: "primary",
        url: { type: "external", external: "#", openInNewTab: false },
      },
      {
        _key: "button2",
        text: "Secondary Action",
        variant: "secondary",
        url: { type: "external", external: "#", openInNewTab: false },
      },
    ];
  }

  return sampleData;
}
