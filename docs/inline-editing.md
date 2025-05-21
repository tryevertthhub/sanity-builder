# Inline Editing Utility in the Page Builder

## Overview

The inline editing utility enables content editors to edit block fields directly within the page preview, providing a fast, intuitive, and visually consistent editing experience. This system is used across all blocks in the page builder, including text, textarea, and array/object fields.

---

## How It Works

- **InlineEdit Utility**: A reusable React component that wraps any text or textarea field, allowing it to be edited inline.
- **State Management**: When a field is edited, the change is propagated up to the parent block and then to the page builder state, ensuring real-time updates.
- **Visual Feedback**: The utility provides visual cues (hover, focus, edit icons) and matches the original field's size and style for a seamless experience.

---

## Implementation Details

### 1. InlineEdit Utility

- Each block file includes (or imports) an `InlineEdit` component.
- Usage example:
  ```tsx
  <InlineEdit
    value={title}
    onChange={(val) => handleFieldChange("title", val)}
    fieldName="title"
    as="h2"
    className="text-4xl font-bold"
  />
  ```
- Props:
  - `value`: The current value of the field.
  - `onChange`: Callback to update the value (calls parent handler).
  - `fieldName`: Name of the field (for accessibility and debugging).
  - `as`: The HTML tag to render (e.g., `span`, `h2`, `p`).
  - `className`, `inputClassName`: Styling for display and input modes.
  - `multiline`: If true, uses a textarea.

### 2. Block Component Integration

- Each block receives an `onEdit` (and/or `onFieldEdit`) prop from the parent (`BlockPreviewWrapper`).
- The block's handler should look like:
  ```tsx
  const handleFieldChange = (field: string, value: any) => {
    if (onEdit) onEdit(field, value);
  };
  ```
- For arrays/objects:
  ```tsx
  const handleItemField = (idx: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    handleFieldChange("items", newItems);
  };
  ```

### 3. Parent State Update

- The parent (`BlockPreviewWrapper`) receives the field and value, and updates the block state via `onUpdate`:
  ```tsx
  <Component
    {...block}
    onEdit={(field, value) => onUpdate(block.id, { [field]: value })}
    onFieldEdit={(field, value) => onUpdate(block.id, { [field]: value })}
  />
  ```
- This ensures all inline edits are persisted in the page builder state.

---

## Adding Inline Editing to a New Block

1. **Add the InlineEdit utility** to the block file (or import it if shared).
2. **Wrap all editable fields** with InlineEdit, passing the correct props.
3. **Implement a handler** that calls `onEdit(field, value)` for each field.
4. **For arrays/objects**, update the relevant item and call `onEdit` with the new array/object.
5. **Ensure the parent** passes `onEdit` (and/or `onFieldEdit`) to the block.

---

## Best Practices

- Always use the `onEdit` prop for inline editing.
- Match the input/textarea style to the display element for a seamless experience.
- Provide clear visual cues for editable fields (hover, focus, edit icon).
- For critical fields (like titles), prevent saving empty strings.
- Test inline editing for all field types (text, textarea, arrays, objects).

---

## Example

```tsx
<InlineEdit
  value={service.title}
  onChange={(val) => handleServiceField(index, "title", val)}
  fieldName={`services.${index}.title`}
  as="dt"
  className="text-xl font-semibold text-white"
/>
```

---

## Summary

The inline editing utility provides a modern, user-friendly editing experience for all blocks in the page builder. By following the patterns above, you can ensure any new or existing block supports inline editing with minimal effort and maximum consistency.
