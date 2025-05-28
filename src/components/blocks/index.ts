// Schema imports
import { testimonialBlock } from "./TestimonialBlock/schema";
import { statsBlock } from "./StatsBlock/schema";
import { servicesOverviewBlock } from "./ServicesOverviewBlock/schema";
import { processBlock } from "./ProcessBlock/schema";
import { newsletterBlock } from "./NewsletterBlock/schema";
import { contactBlock } from "./ContactBlock/schema";
import { blogPreviewBlock } from "./BlogPreviewBlock/schema";
import { whyChooseBlock } from "./WhyChooseBlock/schema";
import { teamBlock } from "./TeamBlock/schema";
import { servicesBlock } from "./ServicesBlock/schema";
import { richTextBlock } from "./RichTextBlock/schema";
import { HeroBlock } from "./HeroBlock";
import { ServicesBlock } from "./ServicesBlock";
import { TeamBlock } from "./TeamBlock";
import { WhyChooseBlock } from "./WhyChooseBlock";
import { BlogPreviewBlock } from "./BlogPreviewBlock";
import { ContactBlock } from "./ContactBlock";
import { NewsletterBlock } from "./NewsletterBlock";
import { ProcessBlock } from "./ProcessBlock";
import { ServicesOverviewBlock } from "./ServicesOverviewBlock";
import { StatsBlock } from "./StatsBlock";
import { TestimonialBlock } from "./TestimonialBlock";
import { BlogsListBlock } from "./BlogsListBlock";
import { RichTextBlock } from "./RichTextBlock";

import { heroBlock } from "./HeroBlock/schema";
import { cta } from "./CtaBlock/schema";
import { CtaBlock } from "./CtaBlock";
import { NavbarBlock } from "./NavbarBlock";
import { navbarBlock } from "./NavbarBlock/schema";
import { FooterBlock } from "./FooterBlock";
import { footerBlock } from "./FooterBlock/schema";
import { blogsListBlock } from "./BlogsListBlock/schema";
import { BlogBlock } from "./BlogBlock";
import { blogBlock } from "@/src/sanity/schemaTypes/blocks/blogBlock";

// Define the block registry that combines both schema and component
export const BLOCKS = {
  cta: {
    schema: cta,
    component: CtaBlock,
  },
  heroBlock: {
    schema: heroBlock,
    component: HeroBlock,
  },
  servicesBlock: {
    schema: servicesBlock,
    component: ServicesBlock,
  },
  teamBlock: {
    schema: teamBlock,
    component: TeamBlock,
  },
  whyChooseBlock: {
    schema: whyChooseBlock,
    component: WhyChooseBlock,
  },
  navbarBlock: {
    schema: navbarBlock,
    component: NavbarBlock,
  },
  footerBlock: {
    schema: footerBlock,
    component: FooterBlock,
  },
  blogPreviewBlock: {
    schema: blogPreviewBlock,
    component: BlogPreviewBlock,
  },
  contactBlock: {
    schema: contactBlock,
    component: ContactBlock,
  },
  newsletterBlock: {
    schema: newsletterBlock,
    component: NewsletterBlock,
  },
  processBlock: {
    schema: processBlock,
    component: ProcessBlock,
  },
  servicesOverviewBlock: {
    schema: servicesOverviewBlock,
    component: ServicesOverviewBlock,
  },
  statsBlock: {
    schema: statsBlock,
    component: StatsBlock,
  },
  testimonialBlock: {
    schema: testimonialBlock,
    component: TestimonialBlock,
  },
  blogsListBlock: {
    schema: blogsListBlock,
    component: BlogsListBlock,
  },
  richTextBlock: {
    schema: richTextBlock,
    component: RichTextBlock,
  },
  blogBlock: {
    component: BlogBlock,
    schema: blogBlock,
  },
} as const;

// Export components for easy access
// Helper to convert camelCase to PascalCase
function toPascalCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Build a mapping that supports both camelCase and PascalCase keys
export const BLOCK_COMPONENTS = Object.fromEntries(
  Object.entries(BLOCKS).flatMap(([key, { component }]) => [
    [key, component], // camelCase
    [toPascalCase(key), component], // PascalCase
  ])
) as Record<string, any>;

// Export schemas for Sanity Studio
export const pageBuilderBlocks = Object.values(BLOCKS).map(
  ({ schema }) => schema
);
