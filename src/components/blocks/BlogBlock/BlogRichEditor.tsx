"use client";
import React, { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  SlashCmdProvider,
  SlashCmd,
  Slash,
  enableKeyboardNavigation,
  createSuggestionsItems,
} from "@harshtalks/slash-tiptap";
import "./editor.css";
import { PortableText } from "@portabletext/react";
import { cn } from "@/src/lib/utils";
import { CalloutBlockExtension } from "./nodes/CalloutBlock";
import { PullQuoteBlockExtension } from "./nodes/PullQuoteBlock";
import { FeatureImageBlockExtension } from "./nodes/FeatureImageBlock";
import { FeatureImageBlock as FeatureImageBlockComponent } from "@/src/components/blogBlocks/FeatureImageBlock";

interface BlogRichEditorProps {
  value: any;
  onChange: (value: any[]) => void;
  isEditMode?: boolean;
}

const suggestions = createSuggestionsItems([
  {
    title: "Heading 1",
    searchTerms: ["h1", "heading1"],
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run(),
  },
  {
    title: "Heading 2",
    searchTerms: ["h2", "heading2"],
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run(),
  },
  {
    title: "Paragraph",
    searchTerms: ["text", "paragraph"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode("paragraph").run(),
  },
  {
    title: "Quote",
    searchTerms: ["blockquote", "quote"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "Code Block",
    searchTerms: ["code", "block"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Bold",
    searchTerms: ["bold", "strong"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBold().run(),
  },
  {
    title: "Italic",
    searchTerms: ["italic", "em"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleItalic().run(),
  },
  {
    title: "Bullet List",
    searchTerms: ["unordered", "point"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Ordered List",
    searchTerms: ["ordered", "point", "numbers"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "Callout Block",
    searchTerms: ["callout", "info", "note"],
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: "calloutBlock",
          attrs: { type: "info" },
          content: [
            {
              type: "titleBlock",
              content: [{ type: "text", text: "Callout Title" }],
            },
            {
              type: "contentBlock",
              content: [{ type: "text", text: "Callout content goes here..." }],
            },
          ],
        })
        .run(),
  },
  {
    title: "Pull Quote",
    searchTerms: ["pullquote", "quote", "highlight"],
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: "pullQuoteBlock",
          content: [
            {
              type: "quoteBlock",
              content: [{ type: "text", text: "Your quote here..." }],
            },
            {
              type: "authorBlock",
              content: [{ type: "text", text: "Author name" }],
            },
          ],
        })
        .run(),
  },
  {
    title: "Feature Image",
    searchTerms: ["image", "feature", "photo"],
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: "featureImageBlock",
          attrs: {
            imageUrl: "",
            fullWidth: true,
          },
          content: [
            {
              type: "altBlock",
              content: [{ type: "text", text: "Feature image description" }],
            },
            {
              type: "captionBlock",
              content: [{ type: "text", text: "Image caption" }],
            },
          ],
        })
        .run(),
  },
]);

function tiptapToPortableText(doc: any): any[] {
  if (!doc || !doc.content) return [];

  return doc.content
    .map((node: any) => {
      switch (node.type) {
        case "heading":
          return {
            _type: "block",
            style: `h${node.attrs.level}`,
            children: node.content
              ? node.content.map((child: any) => ({
                  _type: "span",
                  text: child.text || "",
                  marks: [],
                }))
              : [],
          };
        case "paragraph":
          return {
            _type: "block",
            style: "normal",
            children: node.content
              ? node.content.map((child: any) => ({
                  _type: "span",
                  text: child.text || "",
                  marks: [],
                }))
              : [],
          };
        case "blockquote":
          return {
            _type: "block",
            style: "blockquote",
            children: node.content
              ? node.content.flatMap((child: any) =>
                  child.content
                    ? child.content.map((g: any) => ({
                        _type: "span",
                        text: g.text || "",
                        marks: [],
                      }))
                    : []
                )
              : [],
          };
        case "codeBlock":
          return {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: node.content?.[0]?.text || "",
                marks: ["code"],
              },
            ],
          };
        case "bulletList":
        case "orderedList":
          return node.content
            .map((item: any) =>
              item.content.map((child: any) => ({
                _type: "block",
                style: "normal",
                listItem: node.type === "bulletList" ? "bullet" : "number",
                level: 1,
                children: child.content
                  ? child.content.map((g: any) => ({
                      _type: "span",
                      text: g.text || "",
                      marks: [],
                    }))
                  : [],
              }))
            )
            .flat();
        case "calloutBlock":
          const titleNode = node.content.find(
            (child: any) => child.type === "titleBlock"
          );
          const contentNode = node.content.find(
            (child: any) => child.type === "contentBlock"
          );
          return {
            _type: "calloutBlock",
            type: node.attrs.type || "info",
            title: titleNode?.content?.[0]?.text || "",
            content: contentNode?.content?.[0]?.text || "",
          };
        case "pullQuoteBlock":
          const quoteNode = node.content.find(
            (child: any) => child.type === "quoteBlock"
          );
          const authorNode = node.content.find(
            (child: any) => child.type === "authorBlock"
          );
          return {
            _type: "pullQuoteBlock",
            quote: quoteNode?.content?.[0]?.text || "",
            author: authorNode?.content?.[0]?.text || "",
          };
        case "featureImageBlock":
          const altNode = node.content.find(
            (child: any) => child.type === "altBlock"
          );
          const captionNode = node.content.find(
            (child: any) => child.type === "captionBlock"
          );
          return {
            _type: "featureImageBlock",
            imageUrl: node.attrs.imageUrl || "",
            alt: altNode?.content?.[0]?.text || "",
            caption: captionNode?.content?.[0]?.text || "",
            fullWidth: node.attrs.fullWidth ?? true,
          };
        default:
          return null;
      }
    })
    .flat()
    .filter(Boolean);
}

export function BlogRichEditor({
  value,
  onChange,
  isEditMode = true,
}: BlogRichEditorProps) {
  const initialValueRef = useRef(value);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Slash.configure({
        suggestion: {
          items: () => suggestions,
        },
      }),
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
      }),
      CalloutBlockExtension.CalloutBlock,
      CalloutBlockExtension.TitleBlock,
      CalloutBlockExtension.ContentBlock,
      PullQuoteBlockExtension.PullQuoteBlock,
      PullQuoteBlockExtension.QuoteBlock,
      PullQuoteBlockExtension.AuthorBlock,
      FeatureImageBlockExtension.FeatureImageBlock,
      FeatureImageBlockExtension.AltBlock,
      FeatureImageBlockExtension.CaptionBlock,
    ],
    content: initialValueRef.current || {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "" }],
        },
      ],
    },
    editable: isEditMode,
    editorProps: {
      handleDOMEvents: {
        blur: () => {
          if (!editor || !isEditMode) return;
          try {
            const tiptapJson = editor.getJSON();
            const portableText = tiptapToPortableText(tiptapJson);
            onChange(portableText);
          } catch (error) {
            console.warn("Error converting editor content:", error);
          }
        },
        keydown: (_, event) => enableKeyboardNavigation(event),
      },
      attributes: {
        class: cn(
          "prose prose-xl prose-invert max-w-4xl mx-auto bg-zinc-900/80 rounded-lg p-4 border border-zinc-800 min-h-[200px] outline-none",
          !isEditMode && "pointer-events-none"
        ),
        spellCheck: "true",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor || !value) return;

    const currentContent = editor.getJSON();
    if (JSON.stringify(currentContent) === JSON.stringify(value)) return;

    editor.commands.setContent(
      value || {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "" }],
          },
        ],
      }
    );
  }, [value, editor]);

  return (
    <SlashCmdProvider>
      <EditorContent editor={editor} />
      {isEditMode && (
        <SlashCmd.Root editor={editor}>
          <SlashCmd.Cmd className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900 p-4 shadow-lg transition-all">
            <SlashCmd.Empty>No commands available</SlashCmd.Empty>
            <SlashCmd.List>
              {suggestions.map((item) => (
                <SlashCmd.Item
                  value={item.title}
                  onCommand={(payload) => item.command(payload)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const { from, to } = editor.state.selection;
                    item.command({ editor, range: { from, to } });
                  }}
                  className="flex w-full cursor-pointer rounded-md p-2 text-left text-sm hover:bg-zinc-800 aria-selected:bg-zinc-800 text-white"
                  key={item.title}
                >
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                  </div>
                </SlashCmd.Item>
              ))}
            </SlashCmd.List>
          </SlashCmd.Cmd>
        </SlashCmd.Root>
      )}
    </SlashCmdProvider>
  );
}

const portableTextComponents = {
  types: {
    featureImageBlock: ({
      value,
    }: {
      value: {
        imageUrl: string;
        alt: string;
        caption: string;
        fullWidth: boolean;
      };
    }) => (
      <FeatureImageBlockComponent
        src={value.imageUrl}
        alt={value.alt}
        caption={value.caption}
        className={value.fullWidth ? "w-full" : "max-w-5xl mx-auto"}
      />
    ),
    calloutBlock: ({
      value,
    }: {
      value: { type: string; title: string; content: string };
    }) => (
      <div className="my-8 p-6 rounded-lg bg-gradient-to-r from-blue-900/60 to-zinc-900/80 border-l-4 border-blue-500">
        <h4 className="text-xl font-semibold text-white/90 mb-2">
          {value.title}
        </h4>
        <p className="text-white/70">{value.content}</p>
      </div>
    ),
    pullQuoteBlock: ({
      value,
    }: {
      value: { quote: string; author: string };
    }) => (
      <div className="my-12 bg-gradient-to-r from-purple-900/60 to-zinc-900/80 border-l-4 border-purple-500 p-10 rounded-lg shadow-md">
        <blockquote className="text-3xl font-serif italic text-white/90 mb-6 leading-relaxed">
          {value.quote}
        </blockquote>
        <div className="text-left mt-4">
          <span className="text-purple-300 font-semibold text-lg">
            {value.author}
          </span>
        </div>
      </div>
    ),
  },
};

export function BlogContent({ content }: { content: any }) {
  if (typeof content === "string") {
    return (
      <div
        className="prose prose-xl prose-invert max-w-4xl mx-auto px-4 py-8"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  return (
    <div className="prose prose-xl prose-invert max-w-4xl mx-auto px-4 py-8">
      <PortableText value={content} components={portableTextComponents} />
    </div>
  );
}
