import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Tag, Upload, X, CheckCircle, ImageIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";

// SEO Schema validation
const seoSchema = z.object({
  title: z
    .string()
    .min(30, "Title should be at least 30 characters")
    .max(60, "Title should not exceed 60 characters"),
  description: z
    .string()
    .min(120, "Description should be at least 120 characters")
    .max(160, "Description should not exceed 160 characters"),
  ogImage: z.string().optional(),
  keywords: z.string().optional(),
  canonicalUrl: z.string().url("Please enter a valid URL").optional(),
  noIndex: z.boolean().default(false),
  noFollow: z.boolean().default(false),
});

type SEOData = z.infer<typeof seoSchema>;

interface SEOPanelProps {
  initialData?: SEOData;
  onSave: (data: SEOData) => void;
  isNewPage?: boolean;
  setCompletionCount?: (count: number, total: number) => void;
  onPublish?: (data: SEOData) => void;
  pageId?: string;
  pageTitle?: string;
  pageSlug?: string;
}

export const SEOPanel: React.FC<SEOPanelProps> = ({
  initialData,
  onSave,
  isNewPage = false,
  setCompletionCount,
  onPublish,
  pageId,
  pageTitle,
  pageSlug,
}) => {
  // Use a unique key per page, fallback to 'seo_panel_data'
  const storageKey = pageId ? `seo_${pageId}` : "seo_panel_data";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [seoScore, setSeoScore] = useState(0);
  const [previewData, setPreviewData] = useState<SEOData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Only set defaultValues once on mount
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: formErrors, isDirty },
    reset,
  } = useForm<SEOData>({
    resolver: zodResolver(seoSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      ogImage: "",
      keywords: "",
      canonicalUrl: "",
      noIndex: false,
      noFollow: false,
    },
  });

  const formData = watch();

  const memoizedFormData = useMemo(
    () => ({
      title: formData.title,
      description: formData.description,
      ogImage: formData.ogImage,
      keywords: formData.keywords,
      canonicalUrl: formData.canonicalUrl,
      noIndex: formData.noIndex,
      noFollow: formData.noFollow,
    }),
    [
      formData.title,
      formData.description,
      formData.ogImage,
      formData.keywords,
      formData.canonicalUrl,
      formData.noIndex,
      formData.noFollow,
    ]
  );

  // Reset form when initialData or pageId changes (e.g. when modal opens for a new page)
  React.useEffect(() => {
    reset(
      initialData || {
        title: "",
        description: "",
        ogImage: "",
        keywords: "",
        canonicalUrl: "",
        noIndex: false,
        noFollow: false,
      }
    );
  }, [initialData, pageId, reset]);

  // Calculate completion status
  const completedFields = [
    (memoizedFormData.title || "").trim(),
    (memoizedFormData.description || "").trim(),
    memoizedFormData.ogImage,
    memoizedFormData.keywords,
    memoizedFormData.canonicalUrl,
  ].filter(Boolean).length;
  const totalFields = 5;

  // Handle image upload simulation
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const previewUrl = URL.createObjectURL(file);
      reset({ ...formData, ogImage: previewUrl }, { keepDirty: true });
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

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      await onPublish?.(memoizedFormData);
    } catch (error) {
      console.error("Error publishing page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate SEO score and completion
  const debouncedCalculateScore = useDebouncedCallback(() => {
    let score = 0;
    let total = 0;

    if (memoizedFormData.title) {
      total++;
      if (
        memoizedFormData.title.length >= 30 &&
        memoizedFormData.title.length <= 60
      ) {
        score++;
      }
    }

    if (memoizedFormData.description) {
      total++;
      if (
        memoizedFormData.description.length >= 120 &&
        memoizedFormData.description.length <= 160
      ) {
        score++;
      }
    }

    if (memoizedFormData.ogImage) {
      total++;
      score++;
    }

    if (memoizedFormData.keywords) {
      total++;
      score++;
    }

    if (memoizedFormData.canonicalUrl) {
      total++;
      score++;
    }

    setSeoScore(total > 0 ? (score / total) * 100 : 0);
    setCompletionCount?.(score, total);
  }, 300); // Debounce for 300ms

  // Calculate SEO score and completion
  useEffect(() => {
    debouncedCalculateScore();
  }, [memoizedFormData, debouncedCalculateScore]);

  // Generate preview data
  useEffect(() => {
    setPreviewData(memoizedFormData);
  }, [memoizedFormData]);

  return (
    <div className="relative w-full px-4 py-8 text-zinc-100">
      {/* Page context header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">
            SEO for:
          </div>
          <div className="text-lg font-bold text-blue-400">
            {pageTitle || "Untitled Page"}
            <span className="text-zinc-500 text-sm ml-2">
              {pageSlug ? `(${pageSlug})` : ""}
            </span>
          </div>
        </div>
        {/* Completion/score summary */}
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-zinc-200">
            {completedFields}/{totalFields} complete
          </span>
          <div className="w-24 h-1.5 bg-zinc-700 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(completedFields / totalFields) * 100}%` }}
            />
          </div>
        </div>
      </div>
      {/* SEO panel main card */}
      <div className="bg-zinc-900/95 rounded-2xl shadow-xl border border-zinc-800 p-8 ">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="block font-semibold text-base text-zinc-100">
                SEO Title <span className="text-pink-500">*</span>
              </label>
              {(formData.title || "").trim() && (
                <CheckCircle className="w-4 h-4 text-green-400" />
              )}
            </div>
            <input
              type="text"
              {...register("title")}
              className={`w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-zinc-500 ${
                formErrors.title ? "border-pink-500" : ""
              }`}
              placeholder="Enter SEO title"
            />
            {formErrors.title && (
              <p className="text-pink-400 text-sm mt-1">
                {formErrors.title.message}
              </p>
            )}
          </div>
          {/* Canonical URL */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="block font-semibold text-base text-zinc-100">
                Canonical URL
              </label>
            </div>
            <input
              {...register("canonicalUrl")}
              className={`w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-zinc-500 ${
                formErrors.canonicalUrl ? "border-pink-500" : ""
              }`}
              placeholder="Enter canonical URL"
            />
            {formErrors.canonicalUrl && (
              <p className="text-pink-400 text-sm mt-1">
                {formErrors.canonicalUrl.message}
              </p>
            )}
          </div>
          {/* Description */}
          <div className="space-y-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <label className="block font-semibold text-base text-zinc-100">
                SEO Description <span className="text-pink-500">*</span>
              </label>
              {(formData.description || "").trim() && (
                <CheckCircle className="w-4 h-4 text-green-400" />
              )}
            </div>
            <textarea
              {...register("description")}
              rows={3}
              className={`w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-zinc-500 ${
                formErrors.description ? "border-pink-500" : ""
              }`}
              placeholder="Enter meta description"
            />
            {formErrors.description && (
              <p className="text-pink-400 text-sm mt-1">
                {formErrors.description.message}
              </p>
            )}
          </div>
          {/* Keywords */}
          <div className="space-y-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <label className="block font-semibold text-base text-zinc-100">
                Keywords
              </label>
            </div>
            <input
              {...register("keywords")}
              className={`w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-zinc-500 ${
                formErrors.keywords ? "border-pink-500" : ""
              }`}
              placeholder="Enter keywords (comma-separated)"
            />
          </div>
          {/* OG Image (full width) */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <label className="block font-semibold text-base text-zinc-100">
                SEO Image <span className="text-pink-500">*</span>
              </label>
              {formData.ogImage && (
                <CheckCircle className="w-4 h-4 text-green-400" />
              )}
            </div>
            {formData.ogImage ? (
              <div className="relative group">
                <img
                  src={formData.ogImage}
                  alt="SEO image preview"
                  className="w-full h-32 object-cover rounded-lg border-2 border-zinc-700"
                />
                <button
                  type="button"
                  onClick={() =>
                    reset({ ...formData, ogImage: null }, { keepDirty: true })
                  }
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
            )}
            {formErrors.ogImage && (
              <p className="text-pink-400 text-sm mt-1">
                {formErrors.ogImage.message}
              </p>
            )}
            {uploadError && (
              <p className="text-pink-400 text-sm mt-1">{uploadError}</p>
            )}
          </div>
          {/* Toggles (side by side) */}
          <div className="flex flex-col md:flex-row gap-4 md:col-span-2">
            <div className="flex items-center gap-3 pt-4">
              <label className="flex items-center cursor-pointer">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("noIndex")}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 bg-zinc-700 rounded-full transition-colors duration-200 ${
                      formData.noIndex ? "bg-blue-600" : ""
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        formData.noIndex ? "translate-x-4" : "translate-x-1"
                      } mt-1`}
                    />
                  </div>
                </div>
                <span className="ml-3 text-zinc-200 font-medium cursor-pointer">
                  Do not index this page
                </span>
              </label>
            </div>
            <div className="flex items-center gap-3 pt-4">
              <label className="flex items-center cursor-pointer">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("noFollow")}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 bg-zinc-700 rounded-full transition-colors duration-200 ${
                      formData.noFollow ? "bg-blue-600" : ""
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        formData.noFollow ? "translate-x-4" : "translate-x-1"
                      } mt-1`}
                    />
                  </div>
                </div>
                <span className="ml-3 text-zinc-200 font-medium cursor-pointer">
                  No Follow
                </span>
              </label>
            </div>
          </div>
          <div className="col-span-2 flex justify-end pt-6">
            <button
              type="button"
              onClick={handlePublish}
              disabled={isLoading || !isDirty}
              className={`px-6 py-3 rounded-lg text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Publishing..." : "Publish Page"}
            </button>
          </div>
        </form>

        {/* SEO Score and Progress */}
        <div className="bg-zinc-800/50 rounded-lg p-4 mt-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">SEO Score</h3>
            <span className="text-2xl font-bold text-blue-500">
              {Math.round(seoScore)}%
            </span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${seoScore}%` }}
            />
          </div>
        </div>

        {/* Preview Section */}
        {previewData && (
          <div className="mt-8 border-t border-zinc-800 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Search Engine Preview
            </h3>
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="text-blue-600 text-lg font-medium truncate">
                {previewData.title || "Page Title"}
              </div>
              <div className="text-green-600 text-sm mb-2">
                {previewData.canonicalUrl || "https://example.com/page-url"}
              </div>
              <div className="text-zinc-600 text-sm">
                {previewData.description ||
                  "Page description will appear here..."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
