import { BLOCK_COMPONENTS } from "@/src/components/blocks";

export type BlockType = keyof typeof BLOCK_COMPONENTS;

export type Block = {
  id: string;
  type: BlockType;
  title?: string;
  badge?: string;
  richText?: any[];
};

export type SchemaField = {
  name: string;
  type: string;
  title?: string;
  description?: string;
  initialValue?: any;
};

export type DeviceType = "mobile" | "tablet" | "laptop" | "desktop";
