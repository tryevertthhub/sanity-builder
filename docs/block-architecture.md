# Page Builder Block Architecture

## Overview

The page builder uses a modular block-based architecture that allows for flexible content creation while maintaining data persistence. Each block is a self-contained unit with its own schema, UI component, and state management.

## Core Concepts

### Block State Management

The `useBlockState` hook provides centralized state management for blocks:

```typescript
const {
  blocks, // Current blocks array
  addBlock, // Add a new block
  updateBlock, // Update an existing block
  removeBlock, // Remove a block
  reorderBlocks, // Reorder blocks
  clearBlocks, // Clear all blocks
} = useBlockState();
```

### Block Schema

Each block defines its schema using Sanity's schema definition:

```typescript
export const myBlock = defineType({
  name: "myBlock",
  title: "My Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      initialValue: "Default Title",
    }),
    // ... more fields
  ],
});
```

### Initial Values

Initial values are handled in two ways:

1. Schema-level initial values:

```typescript
initialValue: {
  title: "Default Title",
  description: "Default Description",
}
```

2. Field-level initial values:

```typescript
defineField({
  name: "title",
  type: "string",
  initialValue: "Default Title",
});
```

## Block Lifecycle

1. **Creation**

   - Block is added via `addBlock`
   - Initial values are injected from schema
   - Block is added to state

2. **Editing**

   - Inline editing via `BlockPreviewWrapper`
   - Form editing via `SchemaEditor`
   - Changes are persisted via `updateBlock`

3. **Persistence**
   - Block state is maintained in React state
   - Changes are saved to localStorage
   - Values persist across page refreshes

## Best Practices

1. **Schema Design**

   - Define clear initial values
   - Use validation rules
   - Group related fields in objects

2. **State Management**

   - Use `useBlockState` for all block operations
   - Avoid direct state manipulation
   - Keep block state normalized

3. **Editing Experience**
   - Support both inline and form editing
   - Provide clear feedback on changes
   - Maintain undo/redo capability

## Creating New Blocks

1. Define the schema in `src/components/blocks/[BlockName]/schema.ts`
2. Create the UI component in `src/components/blocks/[BlockName]/index.tsx`
3. Add the block to the registry in `src/components/blocks/index.ts`
4. Test the block in the page builder

## Migration Guide

For existing blocks:

1. Update schema to use proper initial values
2. Ensure block state is managed via `useBlockState`
3. Test persistence of edits
4. Verify block preview functionality

## Troubleshooting

Common issues and solutions:

1. **Edits not persisting**

   - Check if using `useBlockState`
   - Verify update handlers
   - Check localStorage state

2. **Initial values not working**

   - Verify schema definition
   - Check field-level vs schema-level values
   - Test block creation flow

3. **Preview issues**
   - Check component props
   - Verify state updates
   - Test inline editing
