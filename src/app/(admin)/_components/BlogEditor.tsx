"use client";

import React, { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { client } from "@/src/sanity/lib/client";
import { useRouter } from "next/navigation";
import CustomRichTextEditor from "@/src/app/(admin)/_components/CustomRichTextEditor";
import RichTextEditor from "./RichTextEditor";

interface BlogEditorProps {
  initialData?: any;
  onChange: (data: any) => void;
  onSave?: () => void;
}

export function BlogEditor({ initialData, onChange, onSave }: BlogEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [title, setTitle] = useState(
    initialData?.title || "Untitled Blog Post"
  );
  // Change: Initialize content as empty string instead of array
  const [content, setContent] = useState<string>(
    typeof initialData?.content === "string" ? initialData.content : ""
  );

  React.useEffect(() => {
    onChange({ title, content });
  }, [title, content, onChange]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const blogData = {
        _type: "blog",
        title,
        content, // This is now a string (HTML)
        publishedAt: new Date().toISOString(),
      };
      if (initialData?._id) {
        await client.patch(initialData._id).set(blogData).commit();
      } else {
        await client.create(blogData);
      }
      onSave?.();
      router.push("/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="flex flex-col h-full w-full ltr-container"
      dir="ltr"
      lang="en"
      style={{ direction: "ltr", textAlign: "left", unicodeBidi: "embed" }}
    >
      <style>{`
        .ltr-container, .ltr-container * {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: embed !important;
        }
        .ltr-input {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: embed !important;
        }
        .ltr-input::placeholder {
          direction: ltr !important;
          text-align: left !important;
        }
        input[type="text"] {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: embed !important;
        }
      `}</style>
      <div className="flex-1 overflow-auto p-6 w-full">
        <div className="w-full mx-auto flex flex-col gap-4">
          <input
            className="ltr-input w-full text-4xl font-bold bg-transparent border-none outline-none mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Blog Post"
            spellCheck={true}
            autoFocus
            dir="ltr"
            lang="en"
            style={{
              direction: "ltr" as const,
              textAlign: "left" as const,
              unicodeBidi: "embed" as const,
            }}
          />
          <RichTextEditor value={content} onChange={setContent} />
        </div>
      </div>
      <div className="p-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Blog Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}
