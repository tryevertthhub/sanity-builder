import { BLOCK_COMPONENTS } from "@/src/components/blocks";
import { ReactElement } from "react";
import { FieldDefinition } from "sanity";

export type BlockType = keyof typeof BLOCK_COMPONENTS;

export interface Block {
  id: string;
  type: BlockType;
  title?: string;
  badge?: string;
  richText?: any[];
}

export type SchemaField = FieldDefinition & {
  name: string;
  type: string;
  title?: string;
  description?: string | ReactElement;
  fields?: SchemaField[];
  of?: SchemaField[];
};

export type DeviceType = "mobile" | "tablet" | "desktop" | "monitor";
