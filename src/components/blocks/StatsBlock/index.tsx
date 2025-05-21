import { useState, useRef, useEffect, type ReactNode } from "react";

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
          className={`inline-edit-input ${inputClassName} ${className} border-2 border-blue-400/80 bg-zinc-900/90 text-slate-900 rounded-lg p-2 w-full resize-vertical font-inherit focus:bg-zinc-800/90 focus:border-blue-500/80 focus:shadow-lg`}
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
        className={`inline-edit-input ${inputClassName} ${className} border-2 border-blue-400/80 bg-zinc-900/90 text-slate-900 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:bg-zinc-800/90 focus:border-blue-500/80 focus:shadow-lg`}
        style={{ width: "100%" }}
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
      <Tag className="inline-edit-value font-semibold tracking-tight">
        {children || value}
      </Tag>
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

export type StatsBlockProps = {
  _type: "statsBlock";
  title?: string;
  subtitle?: string;
  stats?: {
    _key: string;
    value: string;
    label: string;
    description?: string;
    icon?: {
      asset: {
        url: string;
      };
      alt?: string;
    };
  }[];
  backgroundImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  onEdit?: (field: string, value: any) => void;
};

export function StatsBlock({
  title,
  subtitle,
  stats = [],
  backgroundImage,
  onEdit,
}: StatsBlockProps) {
  const handleField = (field: string, value: any) => {
    if (onEdit) onEdit(field, value);
  };
  const handleStatField = (idx: number, field: string, value: string) => {
    if (!onEdit) return;
    const newStats = [...stats];
    newStats[idx] = { ...newStats[idx], [field]: value };
    onEdit("stats", newStats);
  };
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-100 py-32 sm:py-40">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,theme(colors.blue.50/30%)_0%,transparent_75%)]" />

      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        {backgroundImage ? (
          <>
            <img
              src={backgroundImage.asset.url}
              alt={backgroundImage.alt || ""}
              className="h-full w-full object-cover opacity-5"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-100/90 to-white/80" />
          </>
        ) : (
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-blue-600/5 ring-1 ring-slate-100 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        )}
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-3xl text-center">
          <InlineEdit
            value={title || ""}
            onChange={(val) => handleField("title", val)}
            fieldName="title"
            as="h2"
            className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-wide"
          />
          {subtitle && (
            <InlineEdit
              value={subtitle}
              onChange={(val) => handleField("subtitle", val)}
              fieldName="subtitle"
              as="p"
              className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
              multiline
            />
          )}
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat._key}
                className="relative flex flex-col items-center group hover:scale-105 transition-transform duration-300"
              >
                {/* Decorative element */}
                <div className="absolute -inset-x-3 -inset-y-6 z-0 scale-95 bg-white/80 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:-inset-y-8 backdrop-blur-2xl rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_rgba(59,130,246,0.08)]" />

                {stat.icon && (
                  <div className="relative mb-6 z-10">
                    <div className="rounded-xl bg-white/80 p-3 ring-1 ring-slate-200/50 shadow-lg">
                      <img
                        src={stat.icon.asset.url}
                        alt={stat.icon.alt || ""}
                        className="h-8 w-8"
                      />
                    </div>
                  </div>
                )}

                <InlineEdit
                  value={stat.label}
                  onChange={(val) => handleStatField(index, "label", val)}
                  fieldName={`stats.${index}.label`}
                  as="dt"
                  className="relative z-10 order-2 mt-2 text-base font-medium leading-7 text-slate-600"
                />
                <InlineEdit
                  value={stat.value}
                  onChange={(val) => handleStatField(index, "value", val)}
                  fieldName={`stats.${index}.value`}
                  as="dd"
                  className="relative z-10 order-1 text-4xl font-bold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800"
                />
                {stat.description && (
                  <InlineEdit
                    value={stat.description}
                    onChange={(val) =>
                      handleStatField(index, "description", val)
                    }
                    fieldName={`stats.${index}.description`}
                    as="p"
                    className="relative z-10 order-3 mt-3 text-sm leading-6 text-slate-500"
                    multiline
                  />
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
