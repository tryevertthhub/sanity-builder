import React, { useEffect, useRef, useState } from "react";
import { Tag, Upload, X, CheckCircle } from "lucide-react";

interface SEOData {
  seoTitle: string;
  seoDescription: string;
  seoImage: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
    previewUrl?: string;
  } | null;
  seoNoIndex: boolean;
}

interface SEOPanelProps {
  initialData?: SEOData;
  onSave: (data: SEOData) => void;
  isNewPage?: boolean;
  setCompletionCount?: (count: number, total: number) => void;
  onPublish?: (data: SEOData) => void;
}

export const SEOPanel: React.FC<SEOPanelProps> = ({
  initialData,
  onSave,
  isNewPage = false,
  setCompletionCount,
  onPublish,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [seoData, setSeoData] = useState<SEOData>(
    initialData || {
      seoTitle: "",
      seoDescription: "",
      seoImage: null,
      seoNoIndex: false,
    },
  );

  const [errors, setErrors] = useState<Partial<Record<keyof SEOData, string>>>(
    {},
  );
  const [isDirty, setIsDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Calculate completion status
  const completedFields = [
    seoData.seoTitle.trim(),
    seoData.seoDescription.trim(),
    seoData.seoImage?.asset?._ref,
  ].filter(Boolean).length;
  const totalFields = 3;

  // Validate form fields
  const validate = () => {
    const newErrors: Partial<Record<keyof SEOData, string>> = {};
    let isValid = true;

    if (!seoData.seoTitle.trim()) {
      newErrors.seoTitle = "SEO title is required";
      isValid = false;
    }
    if (!seoData.seoDescription.trim()) {
      newErrors.seoDescription = "SEO description is required";
      isValid = false;
    }
    if (!seoData.seoImage?.asset?._ref) {
      newErrors.seoImage = "SEO image is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Update completion count
  useEffect(() => {
    if (setCompletionCount) {
      setCompletionCount(completedFields, totalFields);
    }
  }, [completedFields, totalFields, setCompletionCount]);

  const handleChange = (field: keyof SEOData, value: any) => {
    setSeoData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle image upload simulation
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a preview URL for the uploaded image
      const previewUrl = URL.createObjectURL(file);

      handleChange("seoImage", {
        _type: "image",
        asset: { _ref: "simulated-upload-id", _type: "reference" },
        previewUrl: previewUrl,
      });
    } catch (err: any) {
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handlePublish = () => {
    const isValid = validate();
    if (isValid && onPublish) {
      onPublish(seoData);
      setIsDirty(false);
    }
  };

  return (
    <div className="relative max-w-xl mx-auto px-4 py-8 text-zinc-100">
      {/* Enhanced header */}
      <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-sm pb-5 mb-8 border-b border-zinc-700/60">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3 ">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Tag className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
                SEO
              </h2>
              <p className="text-sm text-zinc-400 mt-0.5">
                Search Engine Optimization
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-semibold text-zinc-200">
                {completedFields}/{totalFields}
              </span>
              <span className="text-sm text-zinc-400">complete</span>
            </div>
            <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${(completedFields / totalFields) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* SEO Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="block font-semibold text-base text-zinc-100">
              SEO Title <span className="text-pink-500">*</span>
            </label>
            {seoData.seoTitle.trim() && (
              <CheckCircle className="w-4 h-4 text-green-400" />
            )}
          </div>
          <input
            type="text"
            value={seoData.seoTitle}
            onChange={(e) => handleChange("seoTitle", e.target.value)}
            className={`w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-zinc-500 ${
              errors.seoTitle ? "border-pink-500" : ""
            }`}
            placeholder="Enter SEO title"
          />
          {errors.seoTitle && (
            <p className="text-pink-400 text-sm mt-1">{errors.seoTitle}</p>
          )}
        </div>

        {/* SEO Description */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="block font-semibold text-base text-zinc-100">
              SEO Description <span className="text-pink-500">*</span>
            </label>
            {seoData.seoDescription.trim() && (
              <CheckCircle className="w-4 h-4 text-green-400" />
            )}
          </div>
          <textarea
            value={seoData.seoDescription}
            onChange={(e) => handleChange("seoDescription", e.target.value)}
            rows={3}
            className={`w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-zinc-500 ${
              errors.seoDescription ? "border-pink-500" : ""
            }`}
            placeholder="Enter meta description"
          />
          {errors.seoDescription && (
            <p className="text-pink-400 text-sm mt-1">
              {errors.seoDescription}
            </p>
          )}
        </div>

        {/* SEO Image */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="block font-semibold text-base text-zinc-100">
              SEO Image <span className="text-pink-500">*</span>
            </label>
            {seoData.seoImage?.asset?._ref && (
              <CheckCircle className="w-4 h-4 text-green-400" />
            )}
          </div>

          {seoData.seoImage?.asset?._ref ? (
            <div className="relative group">
              <img
                src={
                  seoData.seoImage.previewUrl ||
                  `https://picsum.photos/400/200?random=${seoData.seoImage.asset._ref}`
                }
                alt="SEO image preview"
                className="w-full h-32 object-cover rounded-lg border-2 border-zinc-700"
              />
              <button
                type="button"
                onClick={() => handleChange("seoImage", null)}
                className="absolute top-2 right-2 bg-pink-600 text-white rounded-full p-1 shadow hover:bg-pink-700 transition"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-zinc-600 rounded-lg p-6 text-center hover:border-blue-500 transition">
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-zinc-400 text-sm">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-8 h-8 text-zinc-400" />
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
          )}

          {errors.seoImage && (
            <p className="text-pink-400 text-sm mt-1">{errors.seoImage}</p>
          )}
          {uploadError && (
            <p className="text-pink-400 text-sm mt-1">{uploadError}</p>
          )}
        </div>

        {/* No Index Toggle */}
        <div className="flex items-center gap-3 pt-4">
          <label className="flex items-center cursor-pointer">
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={seoData.seoNoIndex}
                onChange={(e) => handleChange("seoNoIndex", e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-10 h-6 bg-zinc-700 rounded-full transition-colors duration-200 ${
                  seoData.seoNoIndex ? "bg-blue-600" : ""
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    seoData.seoNoIndex ? "translate-x-4" : "translate-x-1"
                  } mt-1`}
                />
              </div>
            </div>
            <span className="ml-3 text-zinc-200 font-medium cursor-pointer">
              Do not index this page
            </span>
          </label>
        </div>
        <p className="text-zinc-400 text-sm ml-1">
          If checked, this content won't be indexed by search engines.
        </p>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            type="button"
            onClick={handlePublish}
            disabled={!isDirty && !isNewPage}
            className={`px-6 py-3 rounded-lg text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDirty || isNewPage
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            {isNewPage ? "Create Page" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
