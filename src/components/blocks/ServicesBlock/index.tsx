"use client";
import { useState, useRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import React from "react";

export type ServicesBlockProps = {
  _type: "servicesBlock";
  heading?: string;
  description?: string;
  services?: {
    _key: string;
    title: string;
    description: string;
    icon?: string;
    features?: {
      title: string;
      description: string;
    }[];
  }[];
};

const IconMap = {
  building: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  ),
  home: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  sparkles: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  ),
};

// --- Icon Picker Popover ---
const ICONS = ["building", "home", "sparkles"];

const IconPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (icon: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="flex items-center justify-center w-14 h-14 rounded-xl bg-zinc-900 border border-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all text-3xl"
        onClick={() => setOpen((v) => !v)}
        tabIndex={0}
        aria-label="Change icon"
        style={{ fontSize: 0 }}
      >
        {IconMap[value as keyof typeof IconMap]}
      </button>
      {open && (
        <div className="absolute z-30 mt-2 left-1/2 -translate-x-1/2 bg-zinc-900 border border-gray-700 rounded-xl shadow-2xl p-3 flex gap-3 flex-wrap min-w-[180px]">
          {ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              className={`w-10 h-10 flex items-center justify-center rounded-lg hover:bg-blue-500/20 ${icon === value ? "border-2 border-blue-400" : "border border-gray-700"}`}
              onClick={() => {
                onChange(icon);
                setOpen(false);
              }}
              aria-label={`Select ${icon} icon`}
            >
              {IconMap[icon as keyof typeof IconMap]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- InlineEdit utility (refined styles) ---
const InlineEdit = ({
  value,
  onChange,
  fieldName,
  as = "span",
  className = "",
  inputClassName = "",
  multiline = false,
  children,
}: {
  value: string;
  onChange: (val: string) => void;
  fieldName: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  children?: React.ReactNode;
}) => {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
    }
  }, [editing]);

  React.useEffect(() => {
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

export function ServicesBlock({
  heading = "",
  description = "",
  services = [],
  onEdit,
}: ServicesBlockProps & { onEdit?: (field: string, value: any) => void }) {
  const [activeService, setActiveService] = useState(0);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const baseId = useId();

  const handleField = (field: string, value: any) => {
    if (onEdit) onEdit(field, value);
  };
  const handleServiceField = (idx: number, field: string, value: any) => {
    if (!onEdit) return;
    const newServices = [...services];
    newServices[idx] = { ...newServices[idx], [field]: value };
    onEdit("services", newServices);
  };
  const handleFeatureField = (
    serviceIdx: number,
    featureIdx: number,
    field: string,
    value: any
  ) => {
    if (!onEdit) return;
    const newServices = [...services];
    const newFeatures = [...(newServices[serviceIdx].features || [])];
    newFeatures[featureIdx] = { ...newFeatures[featureIdx], [field]: value };
    newServices[serviceIdx] = {
      ...newServices[serviceIdx],
      features: newFeatures,
    };
    onEdit("services", newServices);
  };
  const handleAddService = () => {
    if (!onEdit) return;
    const newServices = [
      ...services,
      {
        _key: Math.random().toString(36).slice(2, 10),
        title: "New Service",
        description: "Service description...",
        icon: ICONS[0],
        features: [],
      },
    ];
    onEdit("services", newServices);
  };
  const handleRemoveService = (idx: number) => {
    if (!onEdit) return;
    const newServices = [...services];
    newServices.splice(idx, 1);
    onEdit("services", newServices);
    if (activeService >= newServices.length)
      setActiveService(Math.max(0, newServices.length - 1));
  };
  const handleAddFeature = (serviceIdx: number) => {
    if (!onEdit) return;
    const newServices = [...services];
    const newFeatures = [
      ...(newServices[serviceIdx].features || []),
      {
        title: "New Feature",
        description: "Feature description...",
      },
    ];
    newServices[serviceIdx] = {
      ...newServices[serviceIdx],
      features: newFeatures,
    };
    onEdit("services", newServices);
  };
  const handleRemoveFeature = (serviceIdx: number, featureIdx: number) => {
    if (!onEdit) return;
    const newServices = [...services];
    const newFeatures = [...(newServices[serviceIdx].features || [])];
    newFeatures.splice(featureIdx, 1);
    newServices[serviceIdx] = {
      ...newServices[serviceIdx],
      features: newFeatures,
    };
    onEdit("services", newServices);
  };

  const toggleFeature = (featureId: string) => {
    setExpandedFeature(expandedFeature === featureId ? null : featureId);
  };

  return (
    <section
      ref={ref}
      className="relative h-full  bg-gradient-to-b from-black via-gray-900 to-black pt-32 pb-12 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/10 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <InlineEdit
                value={heading}
                onChange={(val) => handleField("heading", val)}
                fieldName="heading"
                as="span"
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-white to-gray-300"
                inputClassName="text-4xl font-bold tracking-tight bg-transparent text-white"
              />
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              <InlineEdit
                value={description}
                onChange={(val) => handleField("description", val)}
                fieldName="description"
                as="span"
                className="inline-block"
                inputClassName="text-lg leading-8 bg-transparent text-gray-400"
                multiline
              />
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-12">
          {/* Service Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div
              role="tablist"
              aria-label="Services"
              className="sticky top-8 space-y-4"
            >
              {services.map((service, index) => {
                const serviceTabId = `${baseId}-service-tab-${index}`;
                const servicePanelId = `${baseId}-service-panel-${index}`;
                return (
                  <motion.div
                    key={service._key}
                    className="relative group flex flex-col items-stretch bg-zinc-900/70 border border-gray-800 rounded-2xl p-6 mb-4 shadow-lg transition-all duration-200 hover:border-blue-400/60"
                  >
                    <button
                      className="absolute top-2 right-2 bg-zinc-900/80 border border-red-400/60 text-red-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={() => handleRemoveService(index)}
                      tabIndex={-1}
                      aria-label="Remove service"
                      type="button"
                      style={{ fontSize: 0 }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <div className="flex flex-col items-center gap-4 mb-4">
                      <IconPicker
                        value={service.icon}
                        onChange={(icon) =>
                          handleServiceField(index, "icon", icon)
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2 items-center text-center">
                      <InlineEdit
                        value={service.title}
                        onChange={(val) =>
                          handleServiceField(index, "title", val)
                        }
                        fieldName="title"
                        as="span"
                        className="font-bold text-xl text-white mb-1"
                        inputClassName="font-bold text-xl bg-transparent text-white"
                      />
                      <InlineEdit
                        value={service.description}
                        onChange={(val) =>
                          handleServiceField(index, "description", val)
                        }
                        fieldName="description"
                        as="span"
                        className="text-base text-gray-300"
                        inputClassName="text-base bg-transparent text-gray-300"
                        multiline
                      />
                    </div>
                  </motion.div>
                );
              })}
              <button
                className="mt-4 px-4 py-2 rounded-lg border-2 border-dashed border-blue-400/40 text-blue-400 bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors duration-200 w-full"
                onClick={handleAddService}
                type="button"
              >
                <svg
                  className="w-4 h-4 inline-block mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Service
              </button>
            </div>
          </motion.div>

          {/* Features Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-8 relative"
          >
            <AnimatePresence mode="wait">
              {services[activeService]?.features && (
                <motion.div
                  key={services[activeService]._key}
                  id={`${baseId}-service-panel-${activeService}`}
                  role="tabpanel"
                  aria-labelledby={`${baseId}-service-tab-${activeService}`}
                  tabIndex={0}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {services[activeService].features?.map((feature, index) => {
                    const featureId = `${services[activeService]._key}-${index}`;
                    const isExpanded = expandedFeature === featureId;
                    const featureButtonId = `${baseId}-feature-button-${index}`;
                    const featureRegionId = `${baseId}-feature-region-${index}`;

                    return (
                      <motion.div
                        key={featureId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`group rounded-lg border border-gray-800/50 backdrop-blur-sm transition-all duration-300 ${
                          isExpanded
                            ? "bg-gray-800/50"
                            : "bg-gray-900/30 hover:bg-gray-800/30"
                        }`}
                      >
                        <button
                          onClick={() => toggleFeature(featureId)}
                          id={featureButtonId}
                          aria-expanded={isExpanded}
                          aria-controls={featureRegionId}
                          className="w-full text-left px-6 py-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                                  isExpanded ? "bg-white" : "bg-gray-600"
                                }`}
                              />
                              <InlineEdit
                                value={feature.title}
                                onChange={(val) =>
                                  handleFeatureField(
                                    activeService,
                                    index,
                                    "title",
                                    val
                                  )
                                }
                                fieldName="feature-title"
                                as="span"
                                className={`text-lg font-semibold transition-colors duration-300 ${
                                  isExpanded ? "text-white" : "text-gray-300"
                                }`}
                                inputClassName="text-lg font-semibold bg-transparent"
                              />
                            </div>
                            <motion.svg
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              className={`w-5 h-5 transition-colors duration-300 ${
                                isExpanded ? "text-white" : "text-gray-500"
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 9l-7 7-7-7"
                              />
                            </motion.svg>
                          </div>
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-6 pb-4"
                              id={featureRegionId}
                              role="region"
                              aria-labelledby={featureButtonId}
                            >
                              <InlineEdit
                                value={feature.description}
                                onChange={(val) =>
                                  handleFeatureField(
                                    activeService,
                                    index,
                                    "description",
                                    val
                                  )
                                }
                                fieldName="feature-description"
                                as="span"
                                className="text-gray-400 pl-6 inline-block"
                                inputClassName="text-gray-400 bg-transparent"
                                multiline
                              />
                              <button
                                className="ml-4 px-2 py-1 rounded border border-red-400/60 text-red-400 bg-zinc-900/80 hover:bg-zinc-800/80 text-xs"
                                onClick={() =>
                                  handleRemoveFeature(activeService, index)
                                }
                                type="button"
                              >
                                Remove Feature
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                  <button
                    className="mt-4 px-4 py-2 rounded-lg border-2 border-dashed border-blue-400/40 text-blue-400 bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors duration-200 w-full"
                    onClick={() => handleAddFeature(activeService)}
                    type="button"
                  >
                    <svg
                      className="w-4 h-4 inline-block mr-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Feature
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
