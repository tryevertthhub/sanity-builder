import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Fragment } from "@tiptap/pm/model"; // Import Fragment from @tiptap/pm/model
import { CalloutBlockNodeView } from "./CalloutBlockNodeView";

export const CalloutBlock = Node.create({
  name: "calloutBlock",
  group: "block",
  content: "titleBlock contentBlock", // Define content structure with title and content blocks
  draggable: true,
  isolating: true, // Prevents content from being merged with adjacent blocks
  atom: false, // Allow content editing

  addAttributes() {
    return {
      type: { default: "info" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "callout-block",
        getContent: (node: HTMLElement, schema) => {
          // Type assertion to HTMLElement since querySelector is needed
          const titleElement = node.querySelector(
            ".callout-title"
          ) as HTMLElement | null;
          const contentElement = node.querySelector(
            ".callout-content"
          ) as HTMLElement | null;

          const titleText = titleElement?.textContent || "Callout Title";
          const contentText = contentElement?.textContent || "";

          // Create nodes using schema
          const titleNode = schema.nodes.titleBlock.create({}, [
            schema.text(titleText),
          ]);
          const contentNode = schema.nodes.contentBlock.create({}, [
            schema.text(contentText),
          ]);

          // Return as Fragment
          return Fragment.fromArray([titleNode, contentNode]);
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["callout-block", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutBlockNodeView, {
      stopEvent: () => false,
    });
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        // Only delete the block if we're at the start and content is empty
        if (
          $from.parentOffset === 0 &&
          $from.parent.type.name === this.name &&
          $from.parent.textContent.trim() === ""
        ) {
          return editor.commands.deleteNode(this.name);
        }

        return false;
      },
      Enter: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        // If in titleBlock, move to contentBlock instead of adding a newline
        if ($from.parent.type.name === "titleBlock") {
          const contentBlockPos = $from.end() + 1; // Position after titleBlock
          editor.commands.setTextSelection(contentBlockPos);
          return true; // Prevent default Enter behavior
        }

        return false;
      },
    };
  },
});

// Define a titleBlock node to hold the title content
const TitleBlock = Node.create({
  name: "titleBlock",
  group: "block",
  content: "inline*",
  defining: true,

  parseHTML() {
    return [{ tag: "div.callout-title" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: "callout-title" }),
      0,
    ];
  },
});

// Define a contentBlock node to hold the content
const ContentBlock = Node.create({
  name: "contentBlock",
  group: "block",
  content: "inline*",
  defining: true,

  parseHTML() {
    return [{ tag: "div.callout-content" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: "callout-content" }),
      0,
    ];
  },
});

// Export the nodes together
export const CalloutBlockExtension = {
  CalloutBlock,
  TitleBlock,
  ContentBlock,
};
