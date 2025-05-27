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

interface BlogRichEditorProps {
  value: any; // Accepts Tiptap doc object or array
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
                    : [],
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
              })),
            )
            .flat();
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
          "prose prose-xl prose-invert max-w-none bg-zinc-900/80 rounded-lg p-4 border border-zinc-800 min-h-[200px] outline-none",
          !isEditMode && "pointer-events-none",
        ),
        spellCheck: "true",
      },
    },
    immediatelyRender: false,
  });

  // Only update content when value changes from outside
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
      },
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
                  className="flex w-full items-center space-x-2 cursor-pointer rounded-md p-2 text-left text-sm hover:bg-zinc-800 aria-selected:bg-zinc-800 text-white"
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

export function BlogContent({ content }: { content: any }) {
  if (typeof content === "string") {
    // Render HTML string
    return (
      <div
        className="prose prose-xl prose-invert max-w-4xl mx-auto px-4 py-8"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  // Fallback: Render Portable Text
  return (
    <div className="prose prose-xl prose-invert max-w-4xl mx-auto px-4 py-8">
      <PortableText value={content} />
    </div>
  );
}
