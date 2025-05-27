import { defineArrayMember, defineType } from "sanity";
import { BLOCKS } from "@/src/components/blocks";

// Create block types directly from the BLOCKS registry
export const pagebuilderBlockTypes = Object.entries(BLOCKS).map(
  ([type, { schema }]) => ({
    type,
    schema,
  }),
);

export const pageBuilder = defineType({
  name: "pageBuilder",
  type: "array",
  of: pagebuilderBlockTypes.map(({ type }) => defineArrayMember({ type })),
});
