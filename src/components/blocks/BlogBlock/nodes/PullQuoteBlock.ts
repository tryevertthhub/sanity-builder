import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { PullQuoteBlockNodeView } from "./PullQuoteBlockNodeView";

export const PullQuoteBlock = Node.create({
  name: "pullQuoteBlock",
  group: "block",
  content: "",
  draggable: true,

  addAttributes() {
    return {
      quote: { default: "" },
      author: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "pull-quote-block" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["pull-quote-block", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PullQuoteBlockNodeView, {
      stopEvent: (event) => {
        const target = event.event.target as HTMLElement;
        return target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      },
    });
  },
});
