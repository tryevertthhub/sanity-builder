import React, { useRef } from "react";
import { Button } from "@/src/components/ui/button";

export function ImageUpload({
  onUpload,
  isUploading,
}: {
  onUpload: (file: File) => void;
  isUploading?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-zinc-600 transition-colors">
      {isUploading ? (
        <div className="text-zinc-400">Uploading...</div>
      ) : (
        <>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
          >
            Upload Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
        </>
      )}
    </div>
  );
}
