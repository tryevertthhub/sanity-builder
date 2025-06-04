"use client";

import React, { useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { ImageIcon, Upload } from "lucide-react";

interface ImageUploadProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

export function ImageUpload({ onUpload, isUploading }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-zinc-600 transition-colors">
      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-400">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <ImageIcon className="w-8 h-8 text-zinc-400" />
          <div>
            <p className="text-zinc-300 font-medium">Upload Image</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Browse files
            </button>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
}
