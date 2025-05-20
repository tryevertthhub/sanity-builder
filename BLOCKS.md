# Sanity Block Builder System Documentation

## Overview

This document explains the block-based page builder system that allows for modular content creation using Sanity CMS and Next.js.

## Table of Contents

- [Block Generation System](#block-generation-system)
- [Default Block Template](#default-block-template)
- [Block Registry System](#block-registry-system)
- [Query System](#query-system)
- [Integration Flow](#integration-flow)
- [Common Features](#common-features)
- [Creating New Blocks](#creating-new-blocks)

## Block Generation System

When you run the block generator:

```bash
ts-node scripts/generate-block.ts NewBlock
```

It creates a new block with this structure:

```
NewBlock/
├── index.tsx      # React component
├── schema.ts      # Sanity schema definition
├── types.ts       # TypeScript types
└── query.ts       # GROQ query fragment
```

## Default Block Template

### Component Structure (index.tsx)

```tsx
export function NewBlock({ title }: NewBlockProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2>{title}</h2>
      </div>
    </section>
  );
}
```

### Schema Definition (schema.ts)

```typescript
export const newblock = defineType({
  name: "newblock",
  title: "New Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
  ],
});
```

## Block Registry System

Currently registered block types:

### 1. Hero Block (`HeroBlock`)

- Main landing section
- Features:
  - Title
  - Badge
  - Rich text
  - Image
  - Buttons
- Full-width layout with image on one side
- Used for main page headers

### 2. CTA Block (`CTABlock`)

- Call-to-action sections
- Features:
  - Title
  - Rich text
  - Buttons
- Centered layout with background color
- Used for conversion points

### 3. FAQ Accordion (`FaqAccordion`)

- Expandable FAQ sections
- Features:
  - Title
  - Subtitle
  - Expandable FAQ items
  - Each FAQ has title and rich text content
- Used for Q&A sections

### 4. Image Link Cards (`ImageLinkCards`)

- Grid of image cards with links
- Features:
  - Image
  - Title
  - Description
  - Hover effects
  - Transitions
- Used for features, services, or navigation sections

## Query System

The query system uses GROQ with reusable fragments:

```groq
// Common fragments
const imageFragment = /* groq */ `
  image{
    ...,
    "alt": coalesce(asset->altText, asset->originalFilename, "Image-Broken"),
    "blurData": asset->metadata.lqip,
    "dominantColor": asset->metadata.palette.dominant.background,
  }
`;

const richTextFragment = /* groq */ `
  richText[]{
    ...,
    ${markDefsFragment}
  }
`;

const buttonsFragment = /* groq */ `
  buttons[]{
    text,
    variant,
    _key,
    _type,
    "openInNewTab": url.openInNewTab,
    "href": select(
      url.type == "internal" => url.internal->slug.current,
      url.type == "external" => url.external,
      url.href
    ),
  }
`;
```

## Integration Flow

```typescript
// 1. Register block
registerBlock("newblock", NewBlock, newBlockSchema, {
  fragment: newBlockQuery
});

// 2. Add to Sanity Studio
pageBuilderBlocks = [...existing, newBlockSchema];

// 3. Query gets composed automatically
pageBuilder[]{
  ...,
  _type,
  ${allBlockQueries}
}
```

## Common Features

Every block has access to:

- **Content Features**

  - Rich text content
  - Images with optimization
  - Buttons with links
  - SEO metadata

- **UI Features**

  - Dark/light mode support
  - Responsive layouts
  - Hover effects
  - Transitions

- **Development Features**
  - TypeScript type safety
  - Automatic query composition
  - Reusable components
  - Consistent patterns

### Reusable Components

```typescript
// Available components:
<RichText />        // For formatted content
<SanityImage />     // For optimized images
<SanityButtons />   // For CTA buttons
<Badge />           // For labels/tags
```

## Creating New Blocks

1. Generate the block structure:

```bash
ts-node scripts/generate-block.ts NewBlock
```

2. Customize the schema in `schema.ts`:

```typescript
export const newblock = defineType({
  name: "newblock",
  title: "New Block",
  type: "object",
  fields: [
    // Add your custom fields
  ],
});
```

3. Design the component in `index.tsx`:

```typescript
export function NewBlock(props: NewBlockProps) {
  // Implement your component
}
```

4. Add query fragment in `query.ts`:

```typescript
export const newBlockFragment = /* groq */ `
  _type == "newblock" => {
    ...,
    // Add your fields
  }
`;
```

5. Register in `src/components/blocks/index.ts`:

```typescript
registerBlock("newblock", NewBlock, newblock, {
  fragment: newBlockFragment,
});
```

## System Benefits

- **Modularity**: Each block is self-contained
- **Consistency**: Uses same patterns across blocks
- **Type Safety**: Full TypeScript support
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new blocks
- **Flexibility**: Can customize any part

## Best Practices

1. Always include TypeScript types
2. Use existing fragments when possible
3. Follow the established naming conventions
4. Keep components focused and single-purpose
5. Leverage existing utility components
6. Document any custom functionality
7. Test responsive behavior
8. Consider dark mode support
