import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Fragment } from "@tiptap/pm/model";
import { PullQuoteBlockNodeView } from "./PullQuoteBlockNodeView";

export const PullQuoteBlock = Node.create({
  name: "pullQuoteBlock",
  group: "block",
  content: "quoteBlock authorBlock",
  draggable: true,
  isolating: true,
  atom: false,

  addAttributes() {
    return {
      // No attributes needed, content is stored in child nodes
    };
  },

  parseHTML() {
    return [
      {
        tag: "pull-quote-block",
        getContent: (node, schema) => {
          const element = node as HTMLElement;
          const quoteElement = element.querySelector(
            ".pullquote-quote"
          ) as HTMLElement | null;
          const authorElement = element.querySelector(
            ".pullquote-author"
          ) as HTMLElement | null;

          const quoteText = quoteElement?.textContent || "Your quote here...";
          const authorText = authorElement?.textContent || "Author name";

          const quoteNode = schema.nodes.quoteBlock.create({}, [
            schema.text(quoteText),
          ]);
          const authorNode = schema.nodes.authorBlock.create({}, [
            schema.text(authorText),
          ]);

          return Fragment.fromArray([quoteNode, authorNode]);
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["pull-quote-block", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PullQuoteBlockNodeView, {
      stopEvent: () => false,
    });
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        // Delete the block if at the start and content is empty
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

        // If in quoteBlock, move to authorBlock instead of adding a newline
        if ($from.parent.type.name === "quoteBlock") {
          const authorBlockPos = $from.end() + 1; // Position after quoteBlock
          editor.commands.setTextSelection(authorBlockPos);
          return true; // Prevent default Enter behavior
        }

        return false;
      },
    };
  },
});

// Define a quoteBlock node to hold the quote content
const QuoteBlock = Node.create({
  name: "quoteBlock",
  group: "block",
  content: "inline*",
  defining: true,

  parseHTML() {
    return [{ tag: "div.pullquote-quote" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: "pullquote-quote" }),
      0,
    ];
  },
});

// Define an authorBlock node to hold the author content
const AuthorBlock = Node.create({
  name: "authorBlock",
  group: "block",
  content: "inline*",
  defining: true,

  parseHTML() {
    return [{ tag: "div.pullquote-author" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: "pullquote-author" }),
      0,
    ];
  },
});

export const PullQuoteBlockExtension = {
  PullQuoteBlock,
  QuoteBlock,
  AuthorBlock,
};
