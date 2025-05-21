"use client";
import { useState, useRef, useEffect, type ReactNode } from "react";
import Image from "next/image";

// Badge component for eyebrow text
const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "secondary":
        return "bg-white/10 text-white border border-white/20 backdrop-blur-xl";
      case "outline":
        return "bg-transparent border border-blue-200/30 text-blue-100";
      default:
        return "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-200";
    }
  };

  return (
    <span
      className={`inline-flex px-4 py-1.5 text-xs sm:text-sm sm:px-5 sm:py-2 font-medium rounded-full shadow-lg shadow-blue-500/10 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 ${getVariantClasses()} ${className}`}
    >
      {children}
    </span>
  );
};

// Feature Card component
const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
}) => {
  return (
    <div className="group relative px-6 py-5 rounded-xl transition-all duration-300 hover:bg-white/5">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/10 to-blue-600/5">
            <Image
              src={icon.asset.url}
              alt={icon.alt || ""}
              width={24}
              height={24}
              className="text-blue-200"
            />
          </div>
        )}
        <div>
          <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm leading-relaxed text-blue-100/80">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

// InlineEdit utility
const InlineEdit = ({
  value,
  onChange,
  fieldName,
  as = "span",
  className = "",
  inputClassName = "",
  multiline = false,
  children,
  ...props
}: {
  value: string;
  onChange: (val: string) => void;
  fieldName: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  children?: ReactNode;
  [key: string]: any;
}) => {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    setTemp(value);
  }, [value]);

  const handleSave = () => {
    setEditing(false);
    if (temp !== value) onChange(temp);
  };

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSave();
            } else if (e.key === "Escape") {
              setEditing(false);
              setTemp(value);
            }
          }}
          className={`inline-edit-input ${inputClassName} border-2 border-blue-400/80 bg-zinc-900/90 text-white rounded-lg p-2 w-full resize-vertical font-inherit focus:bg-zinc-800/90 focus:border-blue-500/80 focus:shadow-lg`}
          style={{ minHeight: 40, width: "100%" }}
        />
      );
    }
    return (
      <input
        ref={ref as React.RefObject<HTMLInputElement>}
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          else if (e.key === "Escape") {
            setEditing(false);
            setTemp(value);
          }
        }}
        className={`inline-edit-input ${inputClassName} border-2 border-blue-400/80 bg-zinc-900/90 text-white rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:bg-zinc-800/90 focus:border-blue-500/80 focus:shadow-lg`}
        style={{ minWidth: 80 }}
      />
    );
  }

  const Tag = as;
  return (
    <span
      className={`relative group/inline-edit ${className} px-1 py-0.5 rounded transition-all duration-150 hover:bg-blue-400/10 focus-within:bg-blue-400/10`}
      tabIndex={0}
      onClick={() => setEditing(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setEditing(true);
      }}
      role="button"
      aria-label={`Edit ${fieldName}`}
      title={`Edit ${fieldName}`}
      style={{ cursor: "pointer", display: "inline-block" }}
    >
      {as === "input" || as === "button" ? (
        <Tag
          {...props}
          className="inline-edit-value font-semibold tracking-tight"
          value={value}
        />
      ) : (
        <Tag className="inline-edit-value font-semibold tracking-tight">
          {children || value}
        </Tag>
      )}
      <span className="absolute top-1 right-1 z-10 opacity-0 group-hover/inline-edit:opacity-100 transition-opacity pointer-events-auto bg-zinc-900/80 rounded-full p-1 shadow-lg border border-blue-400/60">
        <svg
          className="w-4 h-4 text-blue-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.213-1.213l1-4a4 4 0 01.828-1.414z"
          />
        </svg>
      </span>
      <span className="absolute left-0 right-0 top-0 bottom-0 border border-blue-400/40 rounded pointer-events-none group-hover/inline-edit:border-blue-400/80 transition-all" />
    </span>
  );
};

export type NewsletterBlockProps = {
  _type: "newsletterBlock";
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  description?: string;
  style?: "modern" | "light" | "dark";
  backgroundStyle?: "gradient" | "geometric" | "simple";
  alignment?: "center" | "left";
  features?: {
    _key: string;
    title: string;
    description: string;
    icon?: {
      asset: {
        url: string;
      };
      alt?: string;
    };
  }[];
  formConfig?: {
    buttonText: string;
    buttonStyle: "default" | "outline" | "secondary";
    placeholderText: string;
    successMessage: string;
    emailTo: string;
  };
  backgroundImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
};

export function NewsletterBlock({
  title,
  subtitle,
  eyebrow,
  description,
  features = [],
  formConfig,
  backgroundImage,
  style = "modern",
  backgroundStyle = "gradient",
  alignment = "center",
  onEdit,
}: NewsletterBlockProps & { onEdit?: (field: string, value: any) => void }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef(null);

  const handleFieldChange = (field: string, value: any) => {
    onEdit?.(field, value);
  };

  const handleFeatureField = (index: number, field: string, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    handleFieldChange("features", newFeatures);
  };

  const handleFormConfigField = (field: string, value: any) => {
    handleFieldChange("formConfig", {
      ...formConfig,
      [field]: value,
    });
  };

  const getBackgroundClasses = () => {
    switch (backgroundStyle) {
      case "geometric":
        return "bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900";
      case "simple":
        return "bg-gradient-to-br from-blue-600 to-blue-800";
      default: // gradient
        return "bg-gradient-to-r from-blue-600 to-blue-900";
    }
  };

  const getAlignmentClasses = () => {
    return alignment === "center"
      ? "text-center items-center"
      : "text-left items-start";
  };

  const getButtonClasses = () => {
    switch (formConfig?.buttonStyle) {
      case "outline":
        return "border border-blue-200/20 text-white hover:bg-blue-500/10 backdrop-blur-xl";
      case "secondary":
        return "bg-white/10 text-white hover:bg-white/20 backdrop-blur-xl";
      default:
        return "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/25";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Here you would typically make an API call to your newsletter service
      // For now, we'll simulate a successful subscription
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setEmail("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="relative overflow-hidden isolate rounded-2xl sm:rounded-3xl">
          {/* Background layers */}
          <div className="absolute inset-0 -z-20">
            {/* Main background with enhanced gradient */}
            <div className={`absolute inset-0 ${getBackgroundClasses()}`} />

            {backgroundImage && (
              <div className="absolute inset-0">
                <Image
                  src={backgroundImage.asset.url}
                  alt={backgroundImage.alt || ""}
                  layout="fill"
                  objectFit="cover"
                  className="opacity-10"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/50 to-blue-900/80" />
              </div>
            )}

            {/* Subtle overlay pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,theme(colors.blue.500/0.03)_25%,transparent_25%,transparent_50%,theme(colors.blue.500/0.03)_50%,theme(colors.blue.500/0.03)_75%,transparent_75%,transparent)] bg-[size:64px_64px]" />

            {/* Glow effects */}
            <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2">
              <div className="w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-[100px] opacity-25" />
            </div>

            {/* Border glow */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-white/10" />
          </div>

          {/* Content */}
          <div className="relative z-10 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
            <div
              className={`max-w-4xl mx-auto space-y-6 flex flex-col ${getAlignmentClasses()}`}
            >
              {eyebrow && (
                <div className="transform transition-all duration-300 hover:scale-105">
                  <InlineEdit
                    value={eyebrow}
                    onChange={(val) => handleFieldChange("eyebrow", val)}
                    fieldName="eyebrow"
                    as="span"
                    className="inline-block"
                  >
                    <Badge variant="secondary">{eyebrow}</Badge>
                  </InlineEdit>
                </div>
              )}

              <InlineEdit
                value={title || ""}
                onChange={(val) => handleFieldChange("title", val)}
                fieldName="title"
                as="h2"
                className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white text-balance"
                inputClassName="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white"
              />

              {subtitle && (
                <InlineEdit
                  value={subtitle}
                  onChange={(val) => handleFieldChange("subtitle", val)}
                  fieldName="subtitle"
                  as="p"
                  className="text-lg sm:text-xl text-blue-100/90 max-w-2xl"
                  inputClassName="text-lg sm:text-xl text-blue-100/90"
                />
              )}

              {description && (
                <InlineEdit
                  value={description}
                  onChange={(val) => handleFieldChange("description", val)}
                  fieldName="description"
                  as="p"
                  className="text-base text-blue-100/80 max-w-2xl"
                  inputClassName="text-base text-blue-100/80"
                  multiline
                />
              )}

              {/* Newsletter Form */}
              <div className="w-full max-w-md mx-auto mt-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <InlineEdit
                      value={formConfig?.placeholderText || "Enter your email"}
                      onChange={(val) =>
                        handleFormConfigField("placeholderText", val)
                      }
                      fieldName="formConfig.placeholderText"
                      as="input"
                      type="email"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                      inputClassName="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/50"
                    />
                  </div>
                  <InlineEdit
                    value={formConfig?.buttonText || "Subscribe"}
                    onChange={(val) => handleFormConfigField("buttonText", val)}
                    fieldName="formConfig.buttonText"
                    as="button"
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-300 ${getButtonClasses()} ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    inputClassName={`w-full px-6 py-3 rounded-xl font-medium ${getButtonClasses()}`}
                  />
                </form>

                {isSuccess && (
                  <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-200">
                    <InlineEdit
                      value={
                        formConfig?.successMessage ||
                        "Thanks for subscribing! Please check your email."
                      }
                      onChange={(val) =>
                        handleFormConfigField("successMessage", val)
                      }
                      fieldName="formConfig.successMessage"
                      as="span"
                      className="text-green-200"
                      inputClassName="text-green-200"
                    />
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200">
                    {error}
                  </div>
                )}
              </div>

              {/* Features Grid */}
              {features.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  {features.map((feature, index) => (
                    <div
                      key={feature._key}
                      className="group relative px-6 py-5 rounded-xl transition-all duration-300 hover:bg-white/5"
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-start gap-4">
                        {feature.icon && (
                          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/10 to-blue-600/5">
                            <Image
                              src={feature.icon.asset.url}
                              alt={feature.icon.alt || ""}
                              width={24}
                              height={24}
                              className="text-blue-200"
                            />
                          </div>
                        )}
                        <div>
                          <InlineEdit
                            value={feature.title}
                            onChange={(val) =>
                              handleFeatureField(index, "title", val)
                            }
                            fieldName={`features.${index}.title`}
                            as="h3"
                            className="text-base font-semibold text-white mb-2"
                            inputClassName="text-base font-semibold text-white"
                          />
                          <InlineEdit
                            value={feature.description}
                            onChange={(val) =>
                              handleFeatureField(index, "description", val)
                            }
                            fieldName={`features.${index}.description`}
                            as="p"
                            className="text-sm leading-relaxed text-blue-100/80"
                            inputClassName="text-sm leading-relaxed text-blue-100/80"
                            multiline
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
