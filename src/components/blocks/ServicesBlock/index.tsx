"use client";
import { useState, useRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";

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

export function ServicesBlock({
  heading = "",
  description = "",
  services = [],
}: ServicesBlockProps) {
  const [activeService, setActiveService] = useState(0);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const baseId = useId();

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
            <h2 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-white to-gray-300 sm:text-5xl">
              {heading}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              {description}
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
                  <motion.button
                    key={service._key}
                    id={serviceTabId}
                    role="tab"
                    aria-selected={activeService === index}
                    aria-controls={servicePanelId}
                    onClick={() => setActiveService(index)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                      activeService === index
                        ? "bg-gray-800/50 shadow-lg shadow-black/20 border border-gray-700/50"
                        : "hover:bg-gray-800/30"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          activeService === index
                            ? "text-white bg-gradient-to-br from-gray-700 to-gray-800"
                            : "text-gray-400"
                        }`}
                      >
                        {service.icon &&
                          IconMap[service.icon as keyof typeof IconMap]}
                      </div>
                      <div>
                        <h3
                          className={`font-semibold ${
                            activeService === index
                              ? "text-white"
                              : "text-gray-300"
                          }`}
                        >
                          {service.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
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
                              <h4
                                className={`text-lg font-semibold transition-colors duration-300 ${
                                  isExpanded ? "text-white" : "text-gray-300"
                                }`}
                              >
                                {feature.title}
                              </h4>
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
                              <p className="text-gray-400 pl-6">
                                {feature.description}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
