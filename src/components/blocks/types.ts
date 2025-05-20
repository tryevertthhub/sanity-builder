import { SanityDocument } from "@sanity/client";

export interface BlockProps {
  _type: string;
  _key: string;
}

export interface BlockSchema {
  name: string;
  title: string;
  icon: any;
  type: "object";
  fields: any[];
  preview?: {
    select: Record<string, string>;
    prepare: (selection: any) => { title: string; subtitle: string };
  };
}

export interface BlockQueryFragment {
  fragment: string;
  dependencies?: string[];
}

export interface BlockRegistry {
  [key: string]: {
    component: React.ComponentType<any>;
    schema: BlockSchema;
    query: BlockQueryFragment;
  };
}

// Common field types that can be reused across blocks
export interface CommonFields {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: any;
  buttons?: Array<{
    label: string;
    link: {
      href: string;
      openInNewTab?: boolean;
    };
    variant?: "default" | "outline" | "secondary" | "link";
  }>;
  richText?: any[];
}
