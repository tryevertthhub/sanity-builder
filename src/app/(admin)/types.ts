import { BLOCK_COMPONENTS } from "@/src/components/blocks";
import { ReactElement } from "react";
import { FieldDefinition } from "sanity";

export type PageType = "page" | "homePage";

export type BlockType = keyof typeof BLOCK_COMPONENTS;

export interface Block {
  id?: string;
  type?: string;
  _key?: string;
  _id?: string;
  _type?: string;
  title?: string;
  badge?: string;
  richText?: any[];
  [key: string]: any;
}

export type SchemaField = FieldDefinition & {
  name: string;
  type: string;
  title?: string;
  description?: string | ReactElement;
  fields?: SchemaField[];
  of?: SchemaField[];
};

export type DeviceType = "desktop" | "tablet" | "mobile";
