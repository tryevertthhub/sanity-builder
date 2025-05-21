import { BLOCK_COMPONENTS } from "@/src/components/blocks";
import { ReactElement } from "react";

export type BlockType =
  | "cta"
  | "heroBlock"
  | "servicesBlock"
  | "teamBlock"
  | "whyChooseBlock"
  | "navbarBlock"
  | "footerBlock"
  | "blogPreviewBlock"
  | "contactBlock"
  | "newsletterBlock"
  | "processBlock"
  | "statsBlock"
  | "testimonialBlock"
  | "richTextBlock";

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
  description?: string | ReactElement;
  validation?: any;
  initialValue?: any;
  fields?: SchemaField[];
  of?: any[];
};

export type DeviceType = "desktop" | "tablet" | "mobile" | "laptop";
